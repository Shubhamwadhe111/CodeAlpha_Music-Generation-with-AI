from keras.models import Sequential
from keras.layers import Dense, Dropout, LSTM, Activation, BatchNormalization

def create_network(network_input, n_vocab):
    """
    Create the structure of the neural network.
    
    Args:
        network_input: Training input data (used to determine input shape)
        n_vocab (int): Size of vocabulary (number of unique notes)
        
    Returns:
        Sequential: Compiled Keras model
    """
    model = Sequential()
    
    # First LSTM layer with return sequences
    model.add(LSTM(
        512,
        input_shape=(network_input.shape[1], network_input.shape[2]),
        return_sequences=True,
        recurrent_dropout=0.3
    ))
    model.add(Dropout(0.3))
    model.add(BatchNormalization())
    
    # Second LSTM layer with return sequences
    model.add(LSTM(512, return_sequences=True, recurrent_dropout=0.3))
    model.add(Dropout(0.3))
    model.add(BatchNormalization())
    
    # Third LSTM layer (no return sequences)
    model.add(LSTM(512, recurrent_dropout=0.3))
    model.add(Dropout(0.3))
    model.add(BatchNormalization())
    
    # Dense layers for output
    model.add(Dense(256))
    model.add(Dropout(0.3))
    model.add(Dense(n_vocab))
    model.add(Activation('softmax'))
    
    # Compile with categorical crossentropy loss
    model.compile(
        loss='categorical_crossentropy', 
        optimizer='adam',
        metrics=['accuracy']
    )
    
    return model

if __name__ == "__main__":
    print("Model architecture defined.")
    print("Use train.py to train the model.")
