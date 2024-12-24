from flask import Flask, render_template, request
from flask import abort
import os
from urllib.parse import unquote

app = Flask(__name__)
SECRET_TOKEN = os.getenv('SECRET_TOKEN')

@app.route('/')
def index():
    return 'Hello, Local World!'

@app.route('/flag')
def flag():
    access_token = request.cookies.get('access_token')
    if access_token != SECRET_TOKEN:
        abort(403) 
    color = unquote(request.args.get('color', 'white'))
    flag=os.getenv('FLAG')
    return render_template('flag.html', color=color , flag=flag)

if __name__ == '__main__':
    app.run()

