from flask import Flask, request, jsonify, render_template
import database_helper
import re


app = Flask(__name__)

@app.teardown_request
def after_request(exception):
    database_helper.disconnect_db()


@app.route('/', methods = ['GET', 'POST'])
def root():
    return app.send_static_file('client.html')



@app.route('/sign_up', methods = ['POST'])
def sign_up():
    data = request.get_json()
    print('data', data)
    email = data["email"]
    password = data["password"]
    fname = data["fname"]
    familyname = data["familyname"]
    gender = data["gender"]
    city = data["city"]
    country = data["country"]

    if not (validation(email, password, fname, familyname, gender, city, country)):
        res = jsonify({'success' : False, 'message' : 'validation failed!'})
        return res
    else:
        result = database_helper.add_user(email, password, fname, familyname, gender, city, country)
    if result == True:
        res = jsonify({'success' : True, 'message' : 'Signup successfull!'})
        return res
    else:
        res = jsonify({'success' : False, 'message' : 'signup Error1!'})
        return res

def validation(email, password, fname, familyname, gender, city, country):
    if not (re.match("[^@]+@[^@]+\.[^@]+", email)):
        return False
    elif (len(password) < 5):
        return False
    elif (len(fname) == 0):
        return False
    elif (len(familyname) == 0):
        return False
    elif not (gender == 'Male' or gender == 'Female'):
        return False
    elif (len(city) == 0):
        return False
    elif (len(country) == 0):
        return False
    return True

@app.route('/sign_in', methods = ['POST'])
def sign_in():
    data = request.get_json()
    email = data['email']
    password = data['password']

    if not (database_helper.find_user(email, password)):
        res = jsonify({'success' : False, 'message' : 'Wrong email or password'})
        return res

    result = database_helper.login_user(email)
    if(result):
        res = jsonify({'success' : True, 'message' : 'Signing in', 'data' : result})
        return res
    else:
        res = jsonify({'success' : False, 'message' : 'Something went wrong'})
        return res

@app.route('/sign_out', methods = ['POST'])
def sign_out():
    token = request.headers.get('token')
    print("sign_out token: ", token)

    result = database_helper.logout_user(token)
    if (result == True):
        res = jsonify({'success' : True, 'message' : 'signing out'})
        return res
    else:
        res = jsonify({'success' : False, 'message' : 'Something went wrong'})
        return res

@app.route('/change_password', methods = ['POST'])
def change_password():
    token = request.headers.get('token')
    data = request.get_json()

    oldPassword = data['oldPassword']
    newPassword = data['newPassword']

    if(len(newPassword) < 5):
        res = jsonify({'success' : False, 'message' : 'Too short password'})
        return res
    result = database_helper.change_password(token, oldPassword, newPassword)
    if(result == True):
        res = jsonify({'success' : True, 'message' : 'password changed'})
        return res
    res = jsonify({'success' : False, 'message' : 'Something went wrong'})
    return res

@app.route('/userdata_token', methods = ['GET'])
def get_user_data_by_token():
    token = request.headers.get('token')

    data = database_helper.get_user_data_by_token(token)
    if data != None:
        res = jsonify({'success' : True, 'email' : data[0], 'fname' : data[1], 'familyname' : data[2], 'gender' : data[3], 'city' : data[4], 'country' : data[5]})
        return res
    res = jsonify({'success' : False, 'message' : 'Something went wrong'})
    return res

@app.route('/userdata_email/<email>', methods = ['GET'])
def get_user_data_by_email(email = None):
    token = request.headers.get('token')

    result = database_helper.get_user_data_by_email(token, email)
    if result != None:
        res = jsonify({'success' : True, 'email' : result[0], 'fname' : result[1], 'familyname' : result[2], 'gender' : result[3], 'city' : result[4], 'country' : result[5]})
        return res
    res = jsonify({'success' : False, 'message' : 'Something went wrong'})
    return res

@app.route('/post_message', methods = ['POST'])
def post_message():
    token = request.headers.get('token')
    data = request.get_json()
    to = data['email']
    message = data['message']
    print("post_message email/////////////:", to )
    print("post_message message:", message )

    if message == None:
        res = jsonify({'success' : False, 'message' : 'No message'})
        return res

    result = database_helper.add_message(token, to, message)
    if result == True:
        res = jsonify({'success' : True, 'message' : 'Message posted', "posted_message" : message})
        return res
    res = jsonify({'success' : False, 'message' : 'Something went wrong'})
    return res

@app.route('/messages_token', methods = ['GET'])
def message_token():
    token = request.headers.get('token')

    result = database_helper.messages_token(token)
    print("success tokenmessages:  ", result['success'])
    if result['success']:
        return jsonify({'success' : True, 'data' : result['data'], 'writers' : result['writer']});
    res = jsonify({'success' : False, 'message' : 'Something went wrong'})
    return res


@app.route('/messages_email', methods = ['GET'])
def message_email():
    token = request.headers.get('token')
    emailvalue= request.get_json();
    email=emailvalue['email']

    result = database_helper.messages_email(token, email)
    if (result['success'] == True):
        return jsonify({'success' : True, 'data' : result['data']});
    res = jsonify({'success' : False, 'message' : 'Something went wrong'})
    return res






if __name__ == '__main__':
    app.run(debug=True)