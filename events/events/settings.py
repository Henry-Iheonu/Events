import os
from pathlib import Path
from datetime import timedelta
from dotenv import load_dotenv
import dj_database_url

# Load environment variables from .env
load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent

# Security
SECRET_KEY = os.getenv("DJANGO_SECRET_KEY", "your-default-secret-key")
DEBUG = os.getenv("DEBUG", "False").lower() in ("true", "1", "t")

# Hosts
_raw_allowed = os.getenv("ALLOWED_HOSTS", "localhost,127.0.0.1")
ALLOWED_HOSTS = [h.strip() for h in _raw_allowed.split(",") if h.strip()]

# CSRF trusted origins (helpful for deploys)
CSRF_TRUSTED_ORIGINS = []
for host in ALLOWED_HOSTS:
    if host and host not in ("localhost", "127.0.0.1"):
        if not host.startswith("http"):
            CSRF_TRUSTED_ORIGINS.append(f"https://{host}")

# Apps & middleware
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "rest_framework",
    "rest_framework_simplejwt",
    "corsheaders",
    "events_app",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "events.urls"

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
    "DEFAULT_PERMISSION_CLASSES": (
        "rest_framework.permissions.IsAuthenticated",
    ),
}

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(days=1),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=7),
    "AUTH_HEADER_TYPES": ("Bearer",),
}

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "templates"],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "events.wsgi.application"

# ---------------- DATABASE CONFIG ----------------
USE_LOCAL = os.getenv("USE_LOCAL_POSTGRES", "True").lower() in ("true", "1", "t")

if USE_LOCAL:
    LOCAL_DB_NAME = os.getenv("LOCAL_DB_NAME", "events_db")
    LOCAL_DB_USER = os.getenv("LOCAL_DB_USER", "events_user")
    LOCAL_DB_PASSWORD = os.getenv("LOCAL_DB_PASSWORD", "events_pass")
    LOCAL_DB_HOST = os.getenv("LOCAL_DB_HOST", "localhost")
    LOCAL_DB_PORT = os.getenv("LOCAL_DB_PORT", "5432")

    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.postgresql_psycopg2",
            "NAME": LOCAL_DB_NAME,
            "USER": LOCAL_DB_USER,
            "PASSWORD": LOCAL_DB_PASSWORD,
            "HOST": LOCAL_DB_HOST,
            "PORT": LOCAL_DB_PORT,
            "CONN_MAX_AGE": 600,
        }
    }
else:
    DATABASE_URL = os.getenv("DATABASE_URL", f"sqlite:///{BASE_DIR / 'db.sqlite3'}")
    SSL_REQUIRE = os.getenv("DATABASE_SSL_REQUIRE", "True").lower() in ("true", "1", "t")
    DATABASES = {
        "default": dj_database_url.parse(DATABASE_URL, conn_max_age=600, ssl_require=SSL_REQUIRE)
    }

# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

# Localization
LANGUAGE_CODE = "en-us"
TIME_ZONE = os.getenv("TIME_ZONE", "UTC")
USE_I18N = True
USE_TZ = True

# Static & media
STATIC_URL = "/static/"
STATICFILES_DIRS = [BASE_DIR / "static"]
STATIC_ROOT = BASE_DIR / "staticfiles"

MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# ---------------- CORS ----------------
CORS_ALLOW_ALL_ORIGINS = os.getenv("CORS_ALLOW_ALL_ORIGINS", "False").lower() in ("true", "1", "t")

if not CORS_ALLOW_ALL_ORIGINS:
    _raw_cors = os.getenv("CORS_ALLOWED_ORIGINS", "")
    CORS_ALLOWED_ORIGINS = [h.strip() for h in _raw_cors.split(",") if h.strip()]

# ---------------- Email ----------------
EMAIL_BACKEND = os.getenv("EMAIL_BACKEND", "django.core.mail.backends.smtp.EmailBackend")
EMAIL_HOST = os.getenv("EMAIL_HOST", "smtp.gmail.com")
EMAIL_PORT = int(os.getenv("EMAIL_PORT", 587))
EMAIL_USE_TLS = os.getenv("EMAIL_USE_TLS", "True").lower() in ("true", "1", "t")
EMAIL_HOST_USER = os.getenv("GMAIL_EMAIL")
EMAIL_HOST_PASSWORD = os.getenv("GMAIL_PASSWORD")
DEFAULT_FROM_EMAIL = EMAIL_HOST_USER

# Debug output to help you verify DB config locally
if DEBUG:
    from pprint import pprint
    print("DEBUG is ON. Current DATABASES['default']:")
    pprint(DATABASES["default"])
    print("Allowed Hosts:", ALLOWED_HOSTS)
    if not CORS_ALLOW_ALL_ORIGINS:
        print("CORS Allowed Origins:", CORS_ALLOWED_ORIGINS)
