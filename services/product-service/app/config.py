import os

class Settings:
    PORT: int = int(os.getenv("PORT", "8002"))
    POSTGRES_HOST: str = os.getenv("POSTGRES_PRODUCT_HOST", "localhost")
    POSTGRES_PORT: str = os.getenv("POSTGRES_PRODUCT_PORT", "5432")
    POSTGRES_DB: str = os.getenv("POSTGRES_PRODUCT_DB", "product_db")
    POSTGRES_USER: str = os.getenv("POSTGRES_PRODUCT_USER", "postgres")
    POSTGRES_PASSWORD: str = os.getenv("POSTGRES_PRODUCT_PASSWORD", "postgres")

    @property
    def DATABASE_URL(self) -> str:
        return f"postgresql://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_HOST}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"

settings = Settings()
