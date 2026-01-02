import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    """기본 설정"""
    SQLALCHEMY_DATABASE_URI = 'sqlite:///database/tamjo.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')
    EBIRD_API_KEY = os.getenv('EBIRD_API_KEY', '')
    EBIRD_API_BASE_URL = 'https://api.ebird.org/v2'

class DevelopmentConfig(Config):
    """개발 환경 설정"""
    DEBUG = True
    TESTING = False

class ProductionConfig(Config):
    """프로덕션 환경 설정"""
    DEBUG = False
    TESTING = False

class TestingConfig(Config):
    """테스트 환경 설정"""
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'

config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
}
