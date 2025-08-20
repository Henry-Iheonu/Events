"""
Django settings for events project
- Loads environment variables from system env OR .env (if present on disk)
- Uses DATABASE_URL when present; otherwise falls back to local DB when DEBUG=True
  or when USE_LOCAL_POSTGRES=True. Raises an error in production if no DB configured.
"""

import os
from pathlib import Path
from datetime import timedelta
from urllib.parse import urlparse

from dotenv import load_dotenv
import dj_database_url
from django.core.exceptions import ImproperlyConfigured

BASE_DIR = Path(__file__).resolve().parent.parent

# Load local .env only if it exists (won't overwrite real env vars)
_local_env = BASE_DIR / ".env"
if _local_env.exists():
    load_dotenv(dotenv_path=_local_env, override=False)

# -------------------------
# Basic settings
# -------------------------
SECRET_KEY = os.getenv("DJANGO_SECRET_KEY", "replace-me-with-env-secret")
DEBUG = os.getenv("DEBUG", "False").lower() in ("true", "1", "t")

# Hosts
_raw_allowed = os.getenv("ALLOWED_HOSTS", "localhost,127.0.0.1")
ALLOWED_HOSTS = [h.strip() for h in _raw_allowed.split(",") if h.strip()]

# Build CSRF trusted origins from allowed hosts (if host looks like a bare hostname, add https://)
CSRF_TRUSTED_ORIGINS = []
for host in ALLOWED_HOSTS:
    if not host:
        continue
    if host in ("localhost", "127.0.0.1"):
        continue
    if host.startswith("http://") or host.startswith("https://"):
        CSRF_TRUSTED_ORIGINS.append(host)
    else:
        CSRF_TRUSTED_ORIGINS.append(f"https://{host}")

# -------------------------
# Installed apps & middleware
# -------------------------
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

# -------------------------
# Helper: mask DB URL for safe logging
# -------------------------
def mask_db_url(url: str) -> str:
    """Return masked summary like: postgres://u***:***@host:port/dbname"""
    try:
        p = urlparse(url)
        user = p.username or ""
        host = p.hostname or ""
        port = p.port or ""
        path = p.path.lstrip("/") or ""
        masked_user = user if not user else user[:1] + "***"
        return f"{p.scheme}://{masked_user}:***@{host}:{port}/{path}"
    except Exception:
        return "<invalid-database-url>"

# -------------------------
# DATABASE CONFIG
# -------------------------
DATABASE_URL = os.getenv("DATABASE_URL")
USE_LOCAL_POSTGRES = os.getenv("USE_LOCAL_POSTGRES", "False").lower() in ("true", "1", "t")
SSL_REQUIRE = os.getenv("DATABASE_SSL_REQUIRE", "True").lower() in ("true", "1", "t")

if DATABASE_URL:
    # Use remote DB from DATABASE_URL
    DATABASES = {
        "default": dj_database_url.parse(DATABASE_URL, conn_max_age=600, ssl_require=SSL_REQUIRE)
    }
else:
    # No DATABASE_URL present
    if USE_LOCAL_POSTGRES or DEBUG:
        # Local dev fallback (or explicit override)
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
        # Production: fail fast so we don't accidentally try to connect to an absent localhost DB
        raise ImproperlyConfigured(
            "DATABASE_URL is not set. Set DATABASE_URL in the environment or set USE_LOCAL_POSTGRES=True for local/dev."
        )

# Print safe DB summary when DEBUG so you can confirm what's being used
if DEBUG:
    try:
        if DATABASE_URL:
            db_summary = mask_db_url(DATABASE_URL)
            db_present = True
        else:
            db_default = DATABASES.get("default", {})
            db_summary = {
                "ENGINE": db_default.get("ENGINE"),
                "NAME": db_default.get("NAME"),
                "USER": db_default.get("USER"),
                "HOST": db_default.get("HOST"),
                "PORT": db_default.get("PORT"),
            }
            db_present = bool(db_default)
        print("=== DEBUG DB SUMMARY ===")
        print("DATABASE_URL present in env:", db_present)
        print("DATABASE summary:", db_summary)
        print("Allowed Hosts:", ALLOWED_HOSTS)
        print("========================")
    except Exception as e:
        print("Error printing DB debug info:", repr(e))

# -------------------------
# REST / AUTH
# -------------------------
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

AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

# Internationalization & timezone
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

# CORS
CORS_ALLOW_ALL_ORIGINS = os.getenv("CORS_ALLOW_ALL_ORIGINS", "False").lower() in ("true", "1", "t")
if not CORS_ALLOW_ALL_ORIGINS:
    _raw_cors = os.getenv("CORS_ALLOWED_ORIGINS", "")
    CORS_ALLOWED_ORIGINS = [h.strip() for h in _raw_cors.split(",") if h.strip()]

# Email
EMAIL_BACKEND = os.getenv("EMAIL_BACKEND", "django.core.mail.backends.smtp.EmailBackend")
EMAIL_HOST = os.getenv("EMAIL_HOST", "smtp.gmail.com")
EMAIL_PORT = int(os.getenv("EMAIL_PORT", 587))
EMAIL_USE_TLS = os.getenv("EMAIL_USE_TLS", "True").lower() in ("true", "1", "t")
EMAIL_HOST_USER = os.getenv("GMAIL_EMAIL")
EMAIL_HOST_PASSWORD = os.getenv("GMAIL_PASSWORD")
DEFAULT_FROM_EMAIL = os.getenv("DEFAULT_FROM_EMAIL", EMAIL_HOST_USER)

# Logging (simple)
LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "handlers": {"console": {"class": "logging.StreamHandler"}},
    "root": {"handlers": ["console"], "level": "INFO" if not DEBUG else "DEBUG"},
}
