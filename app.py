from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import os
import sqlite3
from datetime import datetime
from database import init_db, get_db, DATABASE_PATH
from config import config
from ebird_service import search_ebird_species, get_ebird_url
from urllib.parse import urlparse

# Flask 앱 초기화
app = Flask(__name__)
CORS(app)

# 환경 설정
env = os.getenv('FLASK_ENV', 'development')
app.config.from_object(config[env])

# 데이터베이스 초기화
if not os.path.exists(DATABASE_PATH):
    init_db()

# ==================== ROUTES ====================

@app.route('/')
def index():
    """홈 페이지 - 지역 목록"""
    return render_template('index.html')

@app.route('/location/<int:location_id>')
def location_detail(location_id):
    """지역 상세 페이지 - 해당 지역의 새 목록"""
    return render_template('location.html')

# ==================== API ENDPOINTS ====================

# Location API
@app.route('/api/locations', methods=['GET'])
def get_locations():
    """모든 지역 목록 조회"""
    try:
        db = get_db()
        locations = db.execute(
            'SELECT id, name, description, created_at FROM locations ORDER BY name'
        ).fetchall()
        db.close()
        
        return jsonify([dict(loc) for loc in locations])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/locations/<int:location_id>', methods=['GET'])
def get_location(location_id):
    """특정 지역 상세 정보"""
    try:
        db = get_db()
        location = db.execute(
            'SELECT id, name, description, created_at FROM locations WHERE id = ?',
            (location_id,)
        ).fetchone()
        db.close()
        
        if not location:
            return jsonify({'error': 'Location not found'}), 404
        
        return jsonify(dict(location))
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/locations', methods=['POST'])
def create_location():
    """새 지역 추가"""
    try:
        data = request.json
        name = data.get('name', '').strip()
        description = data.get('description', '').strip()
        
        if not name:
            return jsonify({'error': '지역 이름은 필수입니다'}), 400
        
        db = get_db()
        try:
            cursor = db.cursor()
            cursor.execute(
                'INSERT INTO locations (name, description) VALUES (?, ?)',
                (name, description)
            )
            db.commit()
            location_id = cursor.lastrowid
            db.close()
            
            return jsonify({'id': location_id, 'name': name, 'description': description}), 201
        except sqlite3.IntegrityError:
            db.close()
            return jsonify({'error': '이미 존재하는 지역명입니다'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/locations/<int:location_id>', methods=['PUT'])
def update_location(location_id):
    """지역 정보 수정"""
    try:
        data = request.json
        name = data.get('name', '').strip()
        description = data.get('description', '').strip()
        
        if not name:
            return jsonify({'error': '지역 이름은 필수입니다'}), 400
        
        db = get_db()
        try:
            cursor = db.cursor()
            cursor.execute(
                'UPDATE locations SET name = ?, description = ? WHERE id = ?',
                (name, description, location_id)
            )
            db.commit()
            
            if cursor.rowcount == 0:
                db.close()
                return jsonify({'error': 'Location not found'}), 404
            
            db.close()
            return jsonify({'id': location_id, 'name': name, 'description': description})
        except sqlite3.IntegrityError:
            db.close()
            return jsonify({'error': '이미 존재하는 지역명입니다'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/locations/<int:location_id>', methods=['DELETE'])
def delete_location(location_id):
    """지역 삭제 (관련 새도 함께 삭제)"""
    try:
        db = get_db()
        cursor = db.cursor()
        cursor.execute('DELETE FROM locations WHERE id = ?', (location_id,))
        db.commit()
        
        if cursor.rowcount == 0:
            db.close()
            return jsonify({'error': 'Location not found'}), 404
        
        db.close()
        return jsonify({'message': 'Location deleted'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Bird API
@app.route('/api/birds', methods=['GET'])
def get_birds():
    """새 목록 조회 (선택적 지역 필터)"""
    try:
        location_id = request.args.get('location_id', type=int)
        
        db = get_db()
        if location_id:
            birds = db.execute(
                'SELECT id, name, scientific_name, location_id, ebird_species_code, ebird_url, image_url, created_at '
                'FROM birds WHERE location_id = ? ORDER BY name',
                (location_id,)
            ).fetchall()
        else:
            birds = db.execute(
                'SELECT id, name, scientific_name, location_id, ebird_species_code, ebird_url, image_url, created_at '
                'FROM birds ORDER BY name'
            ).fetchall()
        db.close()
        
        return jsonify([dict(bird) for bird in birds])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/birds/<int:bird_id>', methods=['GET'])
def get_bird(bird_id):
    """특정 새 상세 정보"""
    try:
        db = get_db()
        bird = db.execute(
            'SELECT id, name, scientific_name, location_id, ebird_species_code, ebird_url, image_url, created_at '
            'FROM birds WHERE id = ?',
            (bird_id,)
        ).fetchone()
        db.close()
        
        if not bird:
            return jsonify({'error': 'Bird not found'}), 404
        
        return jsonify(dict(bird))
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/birds', methods=['POST'])
def create_bird():
    """새 등록"""
    try:
        data = request.json
        name = data.get('name', '').strip()
        scientific_name = data.get('scientific_name', '').strip()
        location_id = data.get('location_id')
        ebird_url = data.get('ebird_url', '').strip()
        image_url = data.get('image_url', '').strip()

        # 검증: 새 등록은 이름과 eBird URL 만 필수
        if not all([name, ebird_url]):
            return jsonify({'error': '새 이름과 eBird 링크는 필수입니다'}), 400

        # 가능한 경우 ebird_species_code를 URL에서 추출
        ebird_species_code = ''
        try:
            parsed = urlparse(ebird_url)
            # 경로 마지막 부분이 종 코드일 것으로 예상: /species/{code}
            parts = parsed.path.strip('/').split('/')
            if len(parts) >= 2 and parts[-2] == 'species':
                ebird_species_code = parts[-1]
        except Exception:
            ebird_species_code = ''
        
        db = get_db()
        try:
            cursor = db.cursor()
            cursor.execute(
                'INSERT INTO birds (name, scientific_name, location_id, ebird_species_code, ebird_url, image_url) '
                'VALUES (?, ?, ?, ?, ?, ?)',
                (name, scientific_name, location_id, ebird_species_code or None, ebird_url, image_url)
            )
            db.commit()
            bird_id = cursor.lastrowid
            db.close()
            
            return jsonify({
                'id': bird_id,
                'name': name,
                'scientific_name': scientific_name,
                'location_id': location_id,
                'ebird_species_code': ebird_species_code,
                'ebird_url': ebird_url,
                'image_url': image_url
            }), 201
        except sqlite3.IntegrityError as ie:
            db.close()
            if 'ebird_species_code' in str(ie):
                return jsonify({'error': '이미 등록된 종입니다'}), 400
            return jsonify({'error': str(ie)}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/birds/<int:bird_id>', methods=['PUT'])
def update_bird(bird_id):
    """새 정보 수정"""
    try:
        data = request.json
        name = data.get('name', '').strip()
        scientific_name = data.get('scientific_name', '').strip()
        ebird_species_code = data.get('ebird_species_code', '').strip()
        image_url = data.get('image_url', '').strip()
        
        if not all([name, ebird_species_code]):
            return jsonify({'error': '필수 정보가 누락되었습니다'}), 400
        
        ebird_url = get_ebird_url(ebird_species_code)
        
        db = get_db()
        try:
            cursor = db.cursor()
            cursor.execute(
                'UPDATE birds SET name = ?, scientific_name = ?, ebird_species_code = ?, ebird_url = ?, image_url = ? '
                'WHERE id = ?',
                (name, scientific_name, ebird_species_code, ebird_url, image_url, bird_id)
            )
            db.commit()
            
            if cursor.rowcount == 0:
                db.close()
                return jsonify({'error': 'Bird not found'}), 404
            
            db.close()
            return jsonify({
                'id': bird_id,
                'name': name,
                'scientific_name': scientific_name,
                'ebird_species_code': ebird_species_code,
                'ebird_url': ebird_url,
                'image_url': image_url
            })
        except sqlite3.IntegrityError:
            db.close()
            return jsonify({'error': '이미 등록된 종입니다'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/birds/<int:bird_id>', methods=['DELETE'])
def delete_bird(bird_id):
    """새 삭제"""
    try:
        db = get_db()
        cursor = db.cursor()
        cursor.execute('DELETE FROM birds WHERE id = ?', (bird_id,))
        db.commit()
        
        if cursor.rowcount == 0:
            db.close()
            return jsonify({'error': 'Bird not found'}), 404
        
        db.close()
        return jsonify({'message': 'Bird deleted'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# eBird API Search
@app.route('/api/ebird/search', methods=['GET'])
def ebird_search():
    """eBird 종 검색"""
    try:
        query = request.args.get('query', '').strip()
        
        if len(query) < 2:
            return jsonify({'error': '최소 2글자 이상 입력하세요'}), 400
        
        results = search_ebird_species(query)
        return jsonify(results)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ==================== ERROR HANDLERS ====================

@app.errorhandler(404)
def not_found(e):
    return jsonify({'error': 'Not found'}), 404

@app.errorhandler(500)
def server_error(e):
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
