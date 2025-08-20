# settings.py
import os
from pathlib import Path
from datetime import timedelta
from dotenv import load_dotenv
import dj_database_url

# Load .env (local development)
load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent

# SECURITY
SECRET_KEY = os.getenv("DJANGO_SECRET_KEY", "replace-me-with-env-secret")
DEBUG = os.getenv("DEBUG", "False").lower() in ("true", "1", "t")

# Hosts
_raw_allowed = os.getenv("ALLOWED_HOSTS", "localhost,127.0.0.1")
ALLOWED_HOSTS = [h.strip() for h in _raw_allowed.split(",") if h.strip()]

# CSRF trusted origins (useful for deployed hosts)
CSRF_TRUSTED_ORIGINS = []
for host in ALLOWED_HOSTS:
    if host and host not in ("localhost", "127.0.0.1"):
        if not host.startswith("http"):
            CSRF_TRUSTED_ORIGINS.append(f"https://{host}")

# ---------------- INSTALLED APPS & MIDDLEWARE ----------------
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

# ---------------- DATABASE CONFIG (auto-detect) ----------------
# If DATABASE_URL is present, use it. Otherwise fall back to local Postgres.
DATABASE_URL = os.getenv("DATABASE_URL")

if DATABASE_URL:
    # Use DATABASE_URL (production / managed db) and allow optional SSL flag
    SSL_REQUIRE = os.getenv("DATABASE_SSL_REQUIRE", "True").lower() in ("true", "1", "t")
    DATABASES = {
        "default": dj_database_url.parse(DATABASE_URL, conn_max_age=600, ssl_require=SSL_REQUIRE)
    }
else:
    # Local development fallback
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

# When DEBUG, print a small, safe DB summary to stdout for debugging.
if DEBUG:
    try:
        db_default = DATABASES.get("default", {})
        print("DEBUG is ON. Current DATABASES['default'] summary:")
        # Avoid printing passwords — print host/name/user/port/ssl requirement
        print({
            "ENGINE": db_default.get("ENGINE"),
            "NAME": db_default.get("NAME"),
            "USER": db_default.get("USER"),
            "HOST": db_default.get("HOST"),
            "PORT": db_default.get("PORT"),
            # dj_database_url sets OPTIONS/sslmode sometimes — show existence only
            "HAS_SSL": bool(db_default.get("OPTIONS") or db_default.get("SSL_MODE")),
        })
        print("Allowed Hosts:", ALLOWED_HOSTS)
    except Exception as e:
        print("Error printing DB debug info:", repr(e))

# ---------------- AUTH / REST FRAMEWORK ----------------
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

# ---------------- PASSWORD VALIDATION ----------------
AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

# ---------------- INTERNATIONALIZATION ----------------
LANGUAGE_CODE = "en-us"
TIME_ZONE = os.getenv("TIME_ZONE", "UTC")
USE_I18N = True
USE_TZ = True

# ---------------- STATIC & MEDIA ----------------
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

# ---------------- EMAIL ----------------
EMAIL_BACKEND = os.getenv("EMAIL_BACKEND", "django.core.mail.backends.smtp.EmailBackend")
EMAIL_HOST = os.getenv("EMAIL_HOST", "smtp.gmail.com")
EMAIL_PORT = int(os.getenv("EMAIL_PORT", 587))
EMAIL_USE_TLS = os.getenv("EMAIL_USE_TLS", "True").lower() in ("true", "1", "t")
EMAIL_HOST_USER = os.getenv("GMAIL_EMAIL")
EMAIL_HOST_PASSWORD = os.getenv("GMAIL_PASSWORD")
DEFAULT_FROM_EMAIL = os.getenv("DEFAULT_FROM_EMAIL", EMAIL_HOST_USER)

# ---------------- SECURITY RECOMMENDATIONS (runtime reminders) ----------------
# - Ensure DEBUG=False in production.
# - Ensure ALLOWED_HOSTS contains your production host.
# - Keep SECRET_KEY, DATABASE_URL, and EMAIL credentials out of version control.

# Optionally: configure logging (simple example)
LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "handlers": {
        "console": {"class": "logging.StreamHandler"},
    },
    "root": {
        "handlers": ["console"],
        "level": "INFO" if not DEBUG else "DEBUG",
    },
}
