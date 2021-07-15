import numpy as np
from sklearn.utils import shuffle
from sklearn.preprocessing import MinMaxScaler, StandardScaler, LabelEncoder, Normalizer, OrdinalEncoder
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.model_selection import train_test_split
transformers = {
    "minMax": MinMaxScaler(),
    "Standardize": StandardScaler(),
    "label": LabelEncoder(),
    "normalize": Normalizer(),
    "ordinalEncoder": OrdinalEncoder()
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
