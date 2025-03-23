from fastapi import FastAPI
from contextlib import asynccontextmanager

from routers import info, completion

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("app starting up")
    yield
    print("app cleanup")

app = FastAPI(lifespan=lifespan)

app.include_router(info.router)
app.include_router(completion.router)

