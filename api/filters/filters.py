import numpy as np
from sklearn.utils import shuffle
from sklearn.preprocessing import MinMaxScaler, StandardScaler, LabelEncoder, Normalizer, OrdinalEncoder, LabelBinarizer
from sklearn.feature_extraction.text import CountVectorizer
from pandas import read_csv
# url = "https://raw.githubusercontent.com/jbrownlee/Datasets/master/sonar.csv"
# url = "http://127.0.0.1:8000/media/datasets/user_1/mnist_train.csv"
# dataset = read_csv(url)
# dataset = dataset[["Tweets", "label"]]
# # print(dataset)
# data = dataset.values
# X, y = data[0:, :], data[0, :]
# print(X)
# print(X)

# y = LabelEncoder().fit_transform(y.astype('str'))
# trans = CountVectorizer()
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
transformers = {
    "minMax": MinMaxScaler(),
    "Standardize": StandardScaler(),
    "label": LabelEncoder(),
    "normalize": Normalizer(),
    "ordinalEncoder": OrdinalEncoder(),
    "binarize": LabelBinarizer()
}

# print(filters["water"])


def applyFilter(data, filters):
    for filter in filters:
        try:
            transformer = transformers[filter]
        except KeyError:
            continue
        if filter == "label":
            data = transformer.fit_transform(data)
        data = transformer.fit_transform(data.astype(np.float32))
    # print(data)
    return(data)
