import {firebase} from '@react-native-firebase/auth';

const HotelList = async () => {
  return new Promise((resolve, reject) => {
    const ref = firebase.database().ref('RestaurantsData');

    ref.on(
      'value',
      snapshot => {
        const items = snapshot.val() ? Object.entries(snapshot.val()) : [];
        const formattedData = items.map(([key, value]) => ({key, ...value}));
        // const data=snapshot.val()?snapshot.val():[]
        // setRestarunts(formattedData);

        //  console.log(formattedData);
        resolve(formattedData);
      },
      error => {
        reject(error);
      },
    );
  });
};

export const RestaurantsData = {
  HotelList,
};
