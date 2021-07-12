import numpy as np
from sklearn.utils import shuffle
from sklearn.preprocessing import MinMaxScaler, StandardScaler, LabelEncoder
from pandas import read_csv
from tensorflow import keras
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Activation, Dense
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.metrics import categorical_crossentropy
from sklearn.model_selection import train_test_split
url = "https://raw.githubusercontent.com/jbrownlee/Datasets/master/sonar.csv"
# url = "http://127.0.0.1:8000/media/datasets/user_1/data-en.csv"
# dataset = read_csv(url)
# dataset = dataset[["Tweets", "label"]]
# print(dataset.columns)
# data = dataset.values
# X, y = data[:, :-1], data[:, -1]

# X, y = shuffle(X, y)

# y = LabelEncoder().fit_transform(y.astype('str'))
# trans = MinMaxScaler()
# X = trans.fit_transform(X)

# model = Sequential([
#     Dense(units=16, activation="relu"),
#     Dense(units=32, activation="relu"),
#     Dense(units=32, activation="relu"),
#     Dense(units=64, activation="relu"),
#     Dense(units=2, activation="softmax")
# ])

# model.compile(optimizer=Adam(learning_rate=0.0001),
#               loss="sparse_categorical_crossentropy", metrics=["accuracy"])

# model.fit(x=X, y=y, validation_split=0.2, epochs=50, shuffle=True)
