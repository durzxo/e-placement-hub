from flask import Flask, request, jsonify
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
import pickle
import numpy as np

# --- Placeholder for Data/Model ---
# In a real app, you'd load this data from a database/CSV
MOCK_DATA = {
    'cgpa': [9.0, 8.5, 7.2, 9.5, 7.8, 8.1, 6.9, 9.2, 8.7, 7.5],
    'rounds_cleared': [8, 5, 2, 9, 4, 6, 1, 8, 7, 3], # Total successful rounds
    'min_cgpa_drive': [8.0, 7.5, 7.0, 9.0, 7.0, 8.0, 6.5, 8.5, 7.5, 7.0],
    'is_placed': [1, 1, 0, 1, 0, 1, 0, 1, 1, 0] # Target variable (1: Selected, 0: Not Selected)
}

df = pd.DataFrame(MOCK_DATA)
X = df[['cgpa', 'rounds_cleared', 'min_cgpa_drive']]
y = df['is_placed']
model = LogisticRegression().fit(X, y)
# -----------------------------------

app = Flask(__name__)

@app.route('/predict', methods=['POST'])
def predict():
    """
    Receives student data and drive criteria, and returns a placement probability.
    Expected JSON:
    {
      "student_cgpa": 8.5,
      "student_rounds_cleared": 6,
      "drive_min_cgpa": 7.5
    }
    """
    try:
        data = request.get_json()
        
        # 1. Extract features (must match the model's training features)
        features = np.array([[
            data['student_cgpa'],
            data['student_rounds_cleared'],
            data['drive_min_cgpa']
        ]])
        
        # 2. Predict probability
        # [0] is for the 'Not Placed' probability, [1] is for 'Placed' probability
        probability = model.predict_proba(features)[0][1] 
        
        return jsonify({
            'prediction_score': round(probability * 100, 2), # Return as percentage
            'predicted_class': int(probability > 0.5) # 1 or 0
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    # Run Python service on a different port (e.g., 8000)
    app.run(port=8000, debug=True)