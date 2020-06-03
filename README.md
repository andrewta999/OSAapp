# OSAapp
A full-stack web app that retrieves and displays data from an OSA instrument

# Features
1. Get a continuous stream of traces by pressing START button.
2. Stop the stream by pressing STOP button.
3. Get a single trace by pressing SINGLE button
4. Run query by typing query in the input field and hit submit
5. Zoom, pan the plot, and read data from the plot
6. Read log generate by the system
7. Plot persistence (in progress)

# Installation
1. Clone the repository and go to the root of the cloned repo.

2. Open a terminal at the root directory.

3. Make sure your system has Python 3 and Pip installed. Run this command

   **python --version**

3. For clean installation, create a python virtual environment in this directory and activate it.
   Link for instruction on how to create a virtual envinronment in Python (https://docs.python.org/3/library/venv.html)

4. Run this command to install all the Python dependencies needed for this project (you can skip step 3 if you want).

   **pip install -r requirements.txt**

5. After all dependencies have been installed, run this command to open the app.

   **python app.py**

6. The app is live at http://localhost:5000. Open your browser and visit this URL.

# Deployment
The app is deployed to heroku cloud. Visit this link for a quick demo
https://osa-app.herokuapp.com/

# Demo Picture 
Here are some demo pictures.

![Demo1](https://github.com/andrewta999/OSAapp/blob/master/photo/d1.png)
