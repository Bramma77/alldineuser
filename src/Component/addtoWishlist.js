import AsyncStorage from '@react-native-async-storage/async-storage';
import {firebase} from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';

// const currentuser = auth().currentUser.uid;

const addtowish = async key => {
  const currentuser = auth().currentUser.uid;
  console.log('key', key);
  firebase
    .database()
    .ref(`wishlist/${currentuser}/${key}`)
    .set(true)
    .then(() => {
      console.log('Added to wishlist successfully!');
    })
    .catch(error => {
      console.error('Error adding to wishlist: ', error);
    });
};

const removeFromWishlist = async key => {
  const currentuser = auth().currentUser.uid;
  firebase
    .database()
    .ref(`wishlist/${currentuser}/${key}`)
    .remove()
    .then(() => {
      console.log('Removed from wishlist successfully!');
    })
    .catch(error => {
      console.error('Error removing from wishlist: ', error);
    });
};

const getWishlist = currentuser => {
  // const currentuser = auth().currentUser.uid;
  return new Promise((resolve, reject) => {
    const wishlistRef = firebase
      .database()
      .ref('wishlist')
      .child(`${currentuser}`);
    wishlistRef.on(
      'value',
      snapshot => {
        const data = snapshot.val();
        console.log(typeof data, 'wish');
        if (data !== null) {
          const finaldata = Object.keys(data);
          console.log('wishlist data:', finaldata);
          resolve(finaldata);
        } else {
          resolve([]);
        }
      },
      error => {
        reject(error);
      },
    );

    // Cleanup listener
    return () => {
      wishlistRef.off();
    };
  });
};

export const database = {
  addtowish,
  removeFromWishlist,
  getWishlist,
};
