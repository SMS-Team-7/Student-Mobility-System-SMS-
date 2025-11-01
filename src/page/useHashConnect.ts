// import { useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import type { RootState } from '../store';
// import { setLoading, setConnected, setDisconnected } from '../store/hashconnectSlice';
// import { getHashConnectInstance, getInitPromise, getConnectedAccountIds } from '../hashconnect';

// const useHashConnect = () => {
//     const dispatch = useDispatch();
//     const hashconnectState = useSelector((state: RootState) => state.hashconnect);
//     const { isConnected, accountId, isLoading } = hashconnectState;

//     useEffect(() => {
//         const setupHashConnect = async () => {
//             try {
//                 // only run on client side
//                 if (typeof window === 'undefined') return;

//                 // Wait for HashConnect to initialize
//                 const instance = getHashConnectInstance();
//                 await getInitPromise();

//                 // Set up event listeners
//                 instance.pairingEvent.on((pairingData: any) => {
//                     console.log("Pairing event:", pairingData);
//                     const accountIds = getConnectedAccountIds();
//                     if (accountIds && accountIds.length > 0) {
//                         dispatch(setConnected({
//                             accountId: accountIds[0].toString()
//                         }));
//                     }
//                 });

//                 instance.disconnectionEvent.on(() => {
//                     console.log("Disconnection event");
//                     dispatch(setDisconnected());
//                 });

//                 instance.connectionStatusChangeEvent.on((connectionStatus: any) => {
//                     console.log("Connection status change:", connectionStatus);
//                 });

//                 // Check if already connected
//                 const accountIds = getConnectedAccountIds();
//                 if (accountIds && accountIds.length > 0) {
//                     dispatch(setConnected({
//                         accountId: accountIds[0].toString()
//                     }));
//                 }

//                 console.log("HashConnect setup completed");
//             } catch (error) {
//                 console.error("HashConnect setup failed:", error);
//                 dispatch(setLoading(false));
//             }
//         };

//         setupHashConnect();
//     }, [dispatch]);

//     const connect = async () => {
//         dispatch(setLoading(true));
//         try {
//             // Only run on client side
//             if (typeof window === 'undefined') return;

//             console.log("Attempting to connect to wallet...");
//             const instance = getHashConnectInstance();
//             await instance.openPairingModal();
//         } catch (error) {
//             console.error('Connection failed:', error);
//             dispatch(setLoading(false));
//         }
//     };

//     const disconnect = () => {
//         try {
//             // Only run on client side
//             if (typeof window === 'undefined') return;

//             const instance = getHashConnectInstance();
//             instance.disconnect();
//             dispatch(setDisconnected());
//         } catch (error) {
//             console.error('Disconnect failed:', error);
//             dispatch(setDisconnected());
//         }
//     };

//     return {
//         isConnected,
//         accountId,
//         isLoading, connect, disconnect
//     };
// };

// export default useHashConnect;


import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../store';
import { setLoading, setConnected, setDisconnected } from '../store/hashconnectSlice';
import { hc, getHashConnectInstance, getInitPromise, getConnectedAccountIds } from '../hashconnect';

const useHashConnect = () => {
    const dispatch = useDispatch();
    const hashconnectState = useSelector((state: RootState) => state.hashconnect);
    const { isConnected, accountId, isLoading } = hashconnectState;
    const setupAttempted = useRef(false);

    useEffect(() => {
        // Prevent multiple setup attempts
        if (setupAttempted.current) return;
        setupAttempted.current = true;

        const setupHashConnect = async () => {
            try {
                // only run on client side
                if (typeof window === 'undefined') return;

                console.log('Initializing HashConnect...');

                // Wait for HashConnect to initialize with timeout
                const instance = getHashConnectInstance();

                // Add timeout to prevent indefinite waiting
                const initPromise = getInitPromise();
                const timeoutPromise = new Promise((_, reject) =>
                    setTimeout(() => reject(new Error('HashConnect initialization timeout')), 30000)
                );

                await Promise.race([initPromise, timeoutPromise]);
                console.log('HashConnect initialized successfully');

                // Set up event listeners
                instance.pairingEvent.on((pairingData: any) => {
                    console.log("Pairing event:", pairingData);
                    const accountIds = getConnectedAccountIds();
                    if (accountIds && accountIds.length > 0) {
                        dispatch(setConnected({
                            accountId: accountIds[0].toString()
                        }));
                    }
                });

                instance.disconnectionEvent.on(() => {
                    console.log("Disconnection event");
                    dispatch(setDisconnected());
                });

                instance.connectionStatusChangeEvent.on((connectionStatus: any) => {
                    console.log("Connection status change:", connectionStatus);
                });

                // Check if already connected
                const accountIds = getConnectedAccountIds();
                if (accountIds && accountIds.length > 0) {
                    dispatch(setConnected({
                        accountId: accountIds[0].toString()
                    }));
                }

                console.log("HashConnect setup completed");
                dispatch(setLoading(false));
            } catch (error) {
                console.error("HashConnect setup failed:", error);
                // Don't block the app if HashConnect fails to initialize
                dispatch(setLoading(false));

                // Optionally show a user-friendly message
                if (error instanceof Error && error.message.includes('Socket stalled')) {
                    console.warn('WalletConnect relay connection issue. You can still try to connect when clicking the button.');
                }
            }
        };

        setupHashConnect();
    }, [dispatch]);

    const connect = async () => {
        dispatch(setLoading(true));
        try {
            // Only run on client side
            if (typeof window === 'undefined') return;

            console.log("Attempting to connect to wallet...");
            const instance = getHashConnectInstance();

            // Try to reinitialize if needed
            try {
                await getInitPromise();
            } catch (initError) {
                console.log('Reinitializing HashConnect...');
                // If init failed, try to initialize again
                await hc.init();
            }

            await instance.openPairingModal();
        } catch (error) {
            console.error('Connection failed:', error);
            dispatch(setLoading(false));

            // Provide more helpful error message
            if (error instanceof Error) {
                if (error.message.includes('Socket stalled')) {
                    alert('Connection issue with WalletConnect relay. Please check your internet connection and try again.');
                } else {
                    alert('Failed to connect wallet. Please try again.');
                }
            }
        }
    };

    const disconnect = () => {
        try {
            // Only run on client side
            if (typeof window === 'undefined') return;

            const instance = getHashConnectInstance();
            instance.disconnect();
            dispatch(setDisconnected());
        } catch (error) {
            console.error('Disconnect failed:', error);
            dispatch(setDisconnected());
        }
    };

    return {
        isConnected,
        accountId,
        isLoading,
        connect,
        disconnect
    };
};

export default useHashConnect;