import tensorflowjs as tfjs
from tensorflow import keras


test = tfjs.converters.load_keras_model(
    "./media_root/models/user_1/14/model.json")
print(test.summary())

tfjs.converters.save_keras_model(test, "./media_root/models/user_1/13")
