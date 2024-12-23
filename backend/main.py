from fastapi import FastAPI, HTTPException, Body
from pydantic import BaseModel
from pymongo import MongoClient
from hashlib import sha256
import re
from fastapi.middleware.cors import CORSMiddleware  # Import CORSMiddleware

# Create FastAPI app instance
app = FastAPI()

# Add CORS middleware after initializing the app
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or specify your frontend URL here (e.g., "http://localhost:3000")
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
try:
    # Try connecting to MongoDB
    client = MongoClient("mongodb://localhost:27017/")
    client.admin.command('ping')
    print("MongoDB connection successful")
except Exception as e:
    print(f"MongoDB connection failed: {str(e)}")

# MongoDB connection
client = MongoClient("mongodb://localhost:27017/")
db = client["user_db"]
collection = db["users"]

class User(BaseModel):
    email: str
    password: str
    terms_agreed: bool

# Email validation function
def validate_email(email: str) -> bool:
    email_regex = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'
    return re.match(email_regex, email) is not None

# Password strength check function
def check_password_strength(password: str) -> str:
    if len(password) < 8:
        return "Password must be at least 8 characters long"
    if not re.search(r'[A-Z]', password):
        return "Password must include at least one uppercase letter"
    if not re.search(r'[a-z]', password):
        return "Password must include at least one lowercase letter"
    if not re.search(r'[0-9]', password):
        return "Password must include at least one digit"
    if not re.search(r'[@$!%*?&]', password):
        return "Password must include at least one special character"
    return "Password is strong"

# Password hashing function
def hash_password(password: str) -> str:
    return sha256(password.encode()).hexdigest()

@app.post("/register")
async def register_user(user: User):
    try:
        # Validate email format
        if not validate_email(user.email):
            raise HTTPException(status_code=400, detail="Invalid email format")
        
        # Check password strength
        password_strength = check_password_strength(user.password)
        if password_strength != "Password is strong":
            raise HTTPException(status_code=400, detail=password_strength)
        
        # Check if terms were agreed
        if not user.terms_agreed:
            raise HTTPException(status_code=400, detail="You must agree to the Terms and Conditions")
        
        # Hash the password
        hashed_password = hash_password(user.password)
        
        # Store user in MongoDB
        user_data = {
            "email": user.email,
            "password": hashed_password,
            "terms_agreed": user.terms_agreed
        }
        result = collection.insert_one(user_data)
        
        # Return the user ID as a string
        return {"message": f"User registered successfully with ID {str(result.inserted_id)}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error during registration: {str(e)}")


# Login endpoint
@app.post("/login")
async def login_user(email: str = Body(...), password: str = Body(...)):
    # Find the user by email
    user = collection.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=400, detail="Invalid email or password")
    
    # Hash the provided password and compare with stored password
    hashed_password = hash_password(password)
    if hashed_password != user["password"]:
        raise HTTPException(status_code=400, detail="Invalid email or password")
    
    return {"message": "Login successful"}
@app.get("/")
async def read_root():
    return {"message": "Hello, FastAPI!"}

# Health check endpoint (optional)ss
@app.get("/test-connection")
async def test_connection():
    try:
        client.server_info()  # This checks the connection to MongoDB
        return {"message": "MongoDB connection successful"}
    except Exception as e:
        return {"message": f"Error connecting to MongoDB: {str(e)}"}
@app.get("/test_db")
async def test_db():
    try:
        # Test the connection to MongoDB by fetching one document
        user = collection.find_one({})
        if user:
            return {"message": "MongoDB connection successful", "user": user}
        else:
            return {"message": "MongoDB is connected but no data found."}
    except Exception as e:
        # Log the exception and return the error message
        print(f"Error during MongoDB query: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error connecting to MongoDB: {str(e)}")
