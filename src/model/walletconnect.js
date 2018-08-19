import FCM from 'react-native-fcm';
import RNWalletConnect from 'rn-walletconnect-wallet';
import * as ethWallet from './ethWallet';
import personalData from './personalData';

export const walletConnectInstance = {
  pushEndpoint: 'https://walletconnect.balance.io/webhook/push-notify',
  fcmToken: null,
  walletConnector: null,
};

export const walletConnectInit = async (bridgeUrl, sessionId, sharedKey, dappName) => {
  const fcmToken = await FCM.getFCMToken();
  const walletConnector = new RNWalletConnect({
    sessionId,
    sharedKey,
    dappName,
    bridgeUrl,
  });
  walletConnectInstance.walletConnector = walletConnector;
  walletConnectInstance.fcmToken = fcmToken;
};

export const walletConnectSendSession = async () => {
  const address = await ethWallet.loadAddress();
  try {
    await walletConnectInstance.walletConnector.sendSessionStatus({
      fcmToken: walletConnectInstance.fcmToken,
      pushEndpoint: walletConnectInstance.pushEndpoint,
      data: { address, personalData },
    });
  } catch (err) {
    console.log('send session status error', err);
  }
};

export const walletConnectGetTransaction = async transactionId => {
  const transactionData = await walletConnectInstance.walletConnector.getTransactionRequest(transactionId);
  return transactionData;
};

export const walletConnectSendTransactionHash = async (transactionId, success, txHash) => {
  try {
    await walletConnectInstance.walletConnector.sendTransactionStatus(transactionId, { success, txHash });
  } catch (err) {
    console.log('sending txn status error', err);
  }
};
