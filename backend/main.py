from fastapi import FastAPI
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware

from routers import info, completion

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("app starting up")
    yield
    print("app cleanup")

app = FastAPI(lifespan=lifespan)

# Add CORS middleware to allow requests from our frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(info.router)
app.include_router(completion.router)

