from flask import Flask, request, make_response
from flask import redirect, url_for, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/')
def show_app():
    return redirect(url_for('static', filename='index.html'))

@app.route('/get/dispdata', methods=['GET'])
def handle_get_dispdata():
    with open('data/tmp.dmd', 'rb') as file:
        data = file.read()

    response = make_response(data)
    response.headers['Content-Type'] = 'application/octet-stream'
    return response

@app.route('/post/dispdata', methods=['POST'])
def handle_post_dispdata():
    dispdata = request.data
    size = len(dispdata)

    if size > 1024 or size % 2 != 0:
        return jsonify({'message': 'Invalid file size'}), 400

    # store the byte array and update the display
    print("Recieved display data")
    # saving for now
    with open('data/dispdata.dmd', 'wb') as file:
        file.write(dispdata)

    return jsonify({'message': 'Text successfully changed'}), 200

@app.route('/set/delay/', methods=['GET'])
def setDelay():
    delay = int(request.args.get('value'))

    # set delay
    print(delay)

    return jsonify({"message": "Changed speed."}), 200

@app.route('/set/step/', methods=['GET'])
def setStep():
    step = int(request.args.get('value'))

    # set delay
    print(step)

    return jsonify({"message": "Changed step."}), 200

@app.route('/set/random', methods=['GET'])
def setRandom():
    # turn random pixels on!
    print("Random triggered")

    return jsonify({"message": "Random mode activated."}), 200

@app.route('/set/scroll/', methods=['GET'])
def setScroll():
    state = bool(int(request.args.get('state')))

    # Change scrolling state
    print("Scrolling state changed to:", state)

    return jsonify({"message": "Scrolling state changed"}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000)
