from keras.models import Sequential
from keras.layers import Dense
import keras
import pandas as pds


# prepare data
dataset = pds.read_json('data.json', orient='values').values
dataframeX = dataset[:,0:14]
dataframeY = dataset[:,15]


# create model
model = Sequential()
model.add(Dense(12, input_shape=(14,), init='uniform', activation='sigmoid'))
model.add(Dense(12, init='uniform', activation='sigmoid'))
model.add(Dense(12, init='uniform', activation='sigmoid'))
model.add(Dense(1, init='uniform', activation='sigmoid'))
model.summary()
model.compile(loss='mean_squared_error', optimizer='adam', metrics=['accuracy'])


# train model
tbCallBack = keras.callbacks.TensorBoard(log_dir='/tmp/keras_logs', write_graph=True)
model.fit(dataframeX, dataframeY, epochs=50, batch_size=300,  verbose=1, validation_split=0.3, callbacks=[tbCallBack])


# save model and weights
model.save('ouril.h5')
