import sqlite3, random, string
from flask import g, jsonify




def get_db():
	db = getattr(g, '_database', None)
	if db is None:
		db = g._database = connect_to_database()
	return db

def connect_to_database():
	return sqlite3.connect("database.db")

def add_user(email, password, fname, familyname, gender, city, country):
    try:
       c = get_db().cursor()
       c.execute("INSERT INTO  users(email, password, fname, familyname, gender, city, country) VALUES(?,?,?,?,?,?,?)",
       (email, password, fname, familyname, gender, city, country))
       get_db().commit()
       return True 
    except Exception as e:
    	print(e)
    	return False


def add_logged_in_user(email, token):
    user = [email, token]
    db = get_db()
    try:
        db.execute('''INSERT INTO loggedInUsers VALUES (?,?)''', user, )
        db.commit()
        return True
    except:
        return False

def get_logged_in_user_by_token(token):
    db = get_db()
    cur = db.cursor()
    try:
        cur.execute('''SELECT * FROM loggedInUsers WHERE token=?''', [token], )
        result = cur.fetchone()
        return result
    except:
        print("cant fetch user")
        return False

def get_logged_in_user_by_email(email):
    db = get_db()
    cur = db.cursor()
    try:
        cur.execute('''SELECT * FROM loggedInUsers WHERE email=?''', [email], )
        result = cur.fetchone()
        return result
    except:
        return False

def remove_logged_in_user(token):
    db = get_db()
    try:
        db.execute('''DELETE FROM loggedInUsers WHERE token=?''', [token], )
        db.commit()
        return True
    except:
        return False

def generate_token():
	alphabet = string.ascii_letters + string.digits
	return ''.join(random.choice(alphabet) for i in range(36))

def login_user(email):
	try:
		token = generate_token()
		get_db().execute("INSERT INTO loggedIn VALUES(?,?)", [email, token])
		get_db().commit()
		return token
	except Exception as ex:
		print("login_user Error: ", ex)
		return None

def find_user(email, password):
	cursor = get_db().execute("SELECT * FROM users WHERE email=? AND password=?", [email, password])
	rows = cursor.fetchone()
	cursor.close()
	if (rows == None):
		return False
	else:
		return True

def logout_user(token):

	try:
		email = check_logged_in(token)
		if (email[0] == None):
			return False
		else:	
			get_db().execute("DELETE FROM loggedIn WHERE token=?", [token])
			get_db().commit()
			return True
	except:
		return False

def check_logged_in(token):
	try:
		cursor = get_db().execute("SELECT email FROM loggedIn WHERE token=?", [token])
		email = cursor.fetchone()
		cursor.close()
		return email
	except:
		print("check_logged_in EROOR user not logged in ")
		return None

def change_password(token, oldPassword, newPassword):
	try:
		email = check_logged_in(token)
		print("password_email:", email[0])
		if (email[0] == None):
			return False
		cursor = get_db().execute("SELECT password FROM users WHERE email=?", [email[0]])
		password = cursor.fetchone()
		cursor.close()
		if (password[0] == oldPassword and password[0] != None):
			get_db().execute("UPDATE users SET password=? WHERE email=?", [newPassword, email[0]])
			get_db().commit()
			return True
		else:
			print("testFAIL11111")
			return False
	except Exception as ex:
		print("login_user Error: ", ex)
		print("testFAIL2222")
		return False

def get_user_data_by_token(token):
	try:
		email = check_logged_in(token)
		if (email[0] == None):
			return None
		cursor = get_db().execute("SELECT email, fname, familyname, gender, city, country FROM users WHERE email=?", [email[0]])
		data = cursor.fetchone()
		cursor.close()
		return data
	except:
		return None

def get_user_data_by_email(token, email):
	try:
		row = check_logged_in(token)
		if (row == None):
			return None
		cursor = get_db().execute("SELECT email, fname, familyname, gender, city, country FROM users WHERE email=?", [email])
		data = cursor.fetchone()
		cursor.close()
		return data
	except:
		return None

def add_message(token, to, message):
	try:
		email = check_logged_in(token)
		if (email == None):
			return False
		get_db().execute("INSERT INTO WallOfText (reciever, sender, message) VALUES(?,?,?)", [to, email[0], message])
		get_db().commit()
		return True
	except:
		return False


def messages_email(token, email):
	try:
		verify = check_logged_in(token)
		if (verify == None):
			return {'success' : False}
		cursor = get_db().execute("SELECT message From WallOfText WHERE reciever=?", [email])
		messages = cursor.fetchall()
		cursor.close()
		if (len(messages) == 0):
			return {'success' : False, 'data': 'No messages'}
		return {'success' : True, 'data' : messages}
	except:
		return {'success' : False}

def messages_token(token):
	try:
		verify = check_logged_in(token)
		print(verify)
		if (verify == None):
			return {'success' : False}

		cursor = get_db().execute("SELECT message From WallOfText WHERE reciever=?", [verify[0]])
		messages = cursor.fetchall()
		print(messages)
		cursor.close()
		if (len(messages) == 0):
			print("No MESSAGES FOUNDDDDD")
			return {'success' : False, 'data': 'No messages'}
		return {'success' : True, 'data' : messages}
	except:
		print("message verification failure")
		return {'success' : False, 'data':'message verification failure'}




def disconnect_db():
	db = getattr(g, '_database', None)
	if db is not None:
		db.close()






