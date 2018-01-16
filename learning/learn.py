from numpy import array
from keras.models import Sequential
from keras.layers import Dense
from matplotlib import pyplot

import json

with open('data.json') as json_data:
    X = json.load(json_data)

# create model
model = Sequential()
model.add(Dense(17, input_dim=17))
model.add(Dense(17))
model.add(Dense(17))
model.compile(loss='mse', optimizer='adam', metrics=['mse', 'mae', 'mape', 'cosine'])

# train model
history = model.fit(X, X, epochs=500, batch_size=len(X), verbose=2)

# # this only saves the architecture, not the weights
# # save model to json
# model_json = model.to_json()
# with open("model.json", "w") as json_file:
#   json_file.write(model_json)

# save model and weights
model.save('my_model.h5')

# plot metrics
pyplot.plot(history.history['mean_squared_error'])
# pyplot.plot(history.history['mean_absolute_error'])
# pyplot.plot(history.history['mean_absolute_percentage_error'])
# pyplot.plot(history.history['cosine_proximity'])
pyplot.show()