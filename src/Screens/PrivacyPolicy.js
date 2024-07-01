import React from 'react';
import {ScrollView, Text, StyleSheet, View} from 'react-native';

const PrivacyPolicy = () => {
  return (
    <ScrollView style={styles.container}>
      {/* <Text style={styles.header}>Privacy Policy</Text>
      <Text style={styles.lastUpdated}>Last Updated: [Date]</Text> */}

      <Text style={styles.sectionHeader}>1. Introduction</Text>
      <Text style={styles.text}>
        Welcome to [Your App Name]. Your privacy is important to us. This
        Privacy Policy explains how we collect, use, disclose, and safeguard
        your information when you use our mobile application ([Your App Name]).
        Please read this privacy policy carefully. If you do not agree with the
        terms of this privacy policy, please do not access the application.
      </Text>

      <Text style={styles.sectionHeader}>2. Information We Collect</Text>
      <Text style={styles.subHeader}>a. Personal Data</Text>
      <Text style={styles.text}>- Name</Text>
      <Text style={styles.text}>- Email address</Text>
      <Text style={styles.text}>- Phone number</Text>
      <Text style={styles.text}>- Delivery address</Text>
      <Text style={styles.text}>
        - Payment information (processed securely by third-party services)
      </Text>

      <Text style={styles.subHeader}>b. Device Information</Text>
      <Text style={styles.text}>- Device model</Text>
      <Text style={styles.text}>- Operating system</Text>
      <Text style={styles.text}>- Unique device identifiers</Text>
      <Text style={styles.text}>- Mobile network information</Text>

      <Text style={styles.subHeader}>c. Usage Data</Text>
      <Text style={styles.text}>
        - Details of your use of our app, including traffic data, location data,
        and other communication data.
      </Text>

      <Text style={styles.sectionHeader}>3. How We Use Your Information</Text>
      <Text style={styles.text}>
        We use the information we collect for various purposes, including to: -
        Provide, operate, and maintain our app - Improve, personalize, and
        expand our app - Understand and analyze how you use our app - Develop
        new products, services, features, and functionality - Process
        transactions and send related information, such as transaction
        confirmations and invoices - Communicate with you, either directly or
        through one of our partners, including for customer service, to provide
        you with updates and other information relating to the app, and for
        marketing and promotional purposes - Send you text messages and push
        notifications - Find and prevent fraud - For compliance purposes,
        including enforcing our Terms of Service, or other legal rights
      </Text>

      <Text style={styles.sectionHeader}>4. Sharing Your Information</Text>
      <Text style={styles.subHeader}>a. With Service Providers</Text>
      <Text style={styles.text}>
        We may share your information with third-party service providers to
        provide, maintain, and improve our services, including for payment
        processing, data analysis, email delivery, hosting services, customer
        service, and marketing efforts.
      </Text>

      <Text style={styles.subHeader}>b. For Business Transfers</Text>
      <Text style={styles.text}>
        We may share or transfer your information in connection with, or during
        negotiations of, any merger, sale of company assets, financing, or
        acquisition of all or a portion of our business to another company.
      </Text>

      <Text style={styles.subHeader}>c. With Your Consent</Text>
      <Text style={styles.text}>
        We may share your information with your consent or at your direction.
      </Text>

      <Text style={styles.sectionHeader}>5. Data Security</Text>
      <Text style={styles.text}>
        We use administrative, technical, and physical security measures to help
        protect your personal information. While we have taken reasonable steps
        to secure the personal information you provide to us, please be aware
        that despite our efforts, no security measures are perfect or
        impenetrable, and no method of data transmission can be guaranteed
        against any interception or other type of misuse.
      </Text>

      <Text style={styles.sectionHeader}>6. Your Data Protection Rights</Text>
      <Text style={styles.text}>
        Depending on your location, you may have the following rights regarding
        your personal data: - The right to access – You have the right to
        request copies of your personal data. - The right to rectification – You
        have the right to request that we correct any information you believe is
        inaccurate or complete information you believe is incomplete.
      </Text>
      <View style={{marginVertical: 20}}></View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'black',
  },
  lastUpdated: {
    fontSize: 16,
    marginBottom: 20,
    color: 'black',
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: 'black',
  },
  subHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    color: 'black',
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 10,
    color: 'black',
  },
});

export default PrivacyPolicy;
