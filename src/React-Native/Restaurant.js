import React, {useState} from 'react';
import {
  Text,
  View,
  ImageBackground,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';

const Restaurant = () => {
  const [isAdded, setIsAdded] = useState(false);
  const [quantity, setQuantity] = useState(0);
  const [FoodItems, setFoodItems] = useState([
    {
      code: 'N',
      sub_code: 'D',
      title: 'Guac de la Costa',
      subtitle: 'tortillas de maïs, fruit de la passion',
      price: 7,
      count: 0,
    },
    {
      code: 'N',
      sub_code: '',
      title: 'Chicharron y Cerveza',
      subtitle: 'citron vert / Corona sauce',
      price: 3,
      count: 0,
    },
    {
      code: 'N',
      sub_code: '',
      title: 'Chilitos con',
      subtitle: 'padrones tempura, yamuas',
      price: 5,
      count: 0,
    },
    {
      code: 'N',
      sub_code: 'D',
      title: 'Ceviche de Vegetales',
      subtitle: 'Peruvian Corn, Tomatoes, Coconut',
      price: 18,
      count: 0,
    },
    {
      code: 'N',
      sub_code: '',
      title: 'Maguro No Tarutaru',
      subtitle: 'Tuna Tartare, Truffle Ponzu',
      price: 3,
      count: 0,
    },
    {
      code: 'N',
      sub_code: '',
      title: 'Tori Niku',
      subtitle: 'Spatchcock, Yakitori Glaze',
      price: 9,
      count: 0,
    },
    {
      code: 'N',
      sub_code: 'D',
      count: 0,
      title: 'Patagonian Toothfish',
      subtitle: 'Saikyo Miso Glaze, Amazu Pickled',
      price: 45,
    },
  ]);

  //   const[TotalCount,setTotalCount]=useState(0);

  const handlePress = () => {
    if (!isAdded) {
      setIsAdded(true);
      setQuantity(prevQuantity => prevQuantity + 1);
    } else {
      setQuantity(prevQuantity => prevQuantity + 1);
    }
  };

  const [totalCount, setTotalCount] = useState(0);

  const handleAdd = index => {
    const updatedItems = [...FoodItems];
    updatedItems[index].count += 1;
    setFoodItems(updatedItems);
    setTotalCount(totalCount + 1);
  };

  const handleRemove = index => {
    const updatedItems = [...FoodItems];
    updatedItems[index].count -= 1;
    setFoodItems(updatedItems);
    setTotalCount(totalCount - 1);
  };
  return (
    <View style={{flex: 1}}>
      <View style={{height: 200}}>
        <Image
          resizeMode="cover"
          source={{
            uri: 'https://img.freepik.com/free-photo/fresh-pasta-with-hearty-bolognese-parmesan-cheese-generated-by-ai_188544-9469.jpg',
          }}
          style={{flex: 1}}
        />
      </View>
      <View
        style={{
          height: 180,
          borderRadius: 5,
          marginLeft: 20,
          marginRight: 20,
          marginTop: -50,
          backgroundColor: 'white',
          borderWidth: 0,
          elevation: 5,
          alignItems: 'center',
        }}>
        <Text
          style={{
            fontSize: 18,
            color: 'black',
            fontWeight: 'bold',
            marginTop: 10,
          }}>
          Inka Restaurant
        </Text>

        <View style={{marginTop: 20, alignItems: 'center'}}>
          <Text style={{marginTop: 10}}>
            5.0(200+) | All days:09:00 Am -06:00 PM
          </Text>
          <Text>Reach us at:9854562142</Text>
        </View>
        <TouchableOpacity
          style={{
            height: 40,
            width: 150,
            borderWidth: 1,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 10,
            backgroundColor: 'black',
            marginTop: 10,
          }}>
          <Text style={{fontSize: 14, color: 'white'}}>
            Total <Text style={{color: 'yellow '}}>36.00</Text>
          </Text>
        </TouchableOpacity>
        {/* <View style={styles.container}>
          <Text style={styles.itemText}>Food Item</Text>
          <TouchableOpacity style={styles.button} onPress={handlePress}>
            <Text style={styles.buttonText}>
              {isAdded ? 'Plus One' : 'Add'}
            </Text>
          </TouchableOpacity>
          {isAdded && (
            <Text style={styles.quantityText}>Quantity: {quantity}</Text>
          )}
        </View> */}
      </View>
      <View style={{margin: 10, marginBottom: 420}}>
        <Text
          style={{
            fontSize: 18,
            fontWeight: 'bold',
            color: 'black',
            marginTop: 10,
          }}>
          Starter
        </Text>

        <FlatList
          data={FoodItems}
          keyExtractor={(item, index) => index}
          renderItem={({item, index}) => (
            <View style={{height: 100, borderWidth: 0, margin: 5}}>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <View style={{flexDirection: 'row'}}>
                  <View style={{}}>
                    <View
                      style={{
                        borderWidth: 1,
                        width: 20,
                        height: 30,

                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 2,
                      }}>
                      <Text style={{}}>{item.code}</Text>
                    </View>
                    <View
                      style={{
                        borderWidth: 1,
                        width: 20,
                        height: 30,
                        marginTop: 5,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 2,
                      }}>
                      <Text style={{}}>{item.sub_code}</Text>
                    </View>
                  </View>
                  <View>
                    <Text
                      style={{fontSize: 15, color: 'black', marginLeft: 10}}>
                      {item.title}
                    </Text>
                    <Text
                      style={{fontSize: 15, color: 'black', marginLeft: 10}}>
                      {item.subtitle}
                    </Text>
                    <Text
                      style={{fontSize: 15, color: 'black', marginLeft: 10}}>
                      € {item.price}
                    </Text>
                  </View>
                </View>
                {/* {FoodItems} */}
                {item.count === 0 ? (
                  <TouchableOpacity
                    onPress={() => handleAdd(index)}
                    style={{
                      height: 30,
                      width: 80,
                      backgroundColor: 'black',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 10,
                    }}>
                    <Text style={{color: 'white'}}>Add</Text>
                  </TouchableOpacity>
                ) : (
                  <View
                    style={{
                      height: 30,
                      width: 80,
                      borderWidth: 1,
                      flexDirection: 'row',
                      justifyContent: 'space-evenly',
                    }}>
                    <TouchableOpacity onPress={() => handleRemove(index)}>
                      <Text style={{fontSize: 15, color: 'black'}}>--</Text>
                    </TouchableOpacity>
                    <Text>{item.count}</Text>
                    <TouchableOpacity onPress={() => handleAdd(index)}>
                      <Text style={{fontSize: 15, color: 'black'}}> +</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          )}
        />
        <View
          style={{
            height: 50,
            borderWidth: 1,
            flexDirection: 'row',
            backgroundColor: 'black',
            justifyContent: 'space-evenly',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={{color: 'white'}}>View Cart</Text>
          <Text style={{fontSize: 15, color: 'white', marginLeft: 50}}>
            {totalCount}
          </Text>
        </View>
      </View>
    </View>
  );
};
export default Restaurant;
const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
  },
  itemText: {
    fontSize: 18,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  quantityText: {
    marginTop: 10,
    fontSize: 16,
  },
});
