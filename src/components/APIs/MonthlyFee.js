import React, { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import AxiosInstance from '../../config/AxiosConfig';
import { loadStripe, PaymentElement, Elements, useStripe } from "@stripe/react-stripe-js"


const MonthlyFeeContent = () => {
    const [monthlyFee, setMonthlyFee] = useState([]);
    const stripe = useStripe();

    useEffect(() => {
        loadMonthlyFee();
    }, []);

    const loadMonthlyFee = async () => {
        try {
            const res = await AxiosInstance.get("http://127.0.0.1:8000/monthly-fees/pending/");
            if (res.data) setMonthlyFee(res.data);
        } catch (error) {
            console.error("Error fetching monthly fees: ", error);
        }
    };

    const handleStripePayment = async (feeId) => {
        try {
            const res = await AxiosInstance.post("http://127.0.0.1:8000/transaction/stripe/", {
                ids: JSON.stringify([feeId])
            });

            if (res.data && res.data.sessionId) {
                const { error } = await stripe.redirectToCheckout({
                    sessionId: res.data.sessionId, // Dùng sessionId, không phải clientSecret
                });

                if (error) {
                    console.log("Stripe error:", error);
                    alert("Thanh toán thất bại");
                }
            }
        } catch (error) {
            console.log("Lỗi khi gọi API Stripe:", error);
            alert("Thanh toán thất bại");
        }
    };

    const handleMomoPayment = async (feeId) => {
        alert('Navigate to Momo payment site')
    }


    return (
        <Box display={'flex'}>
            {monthlyFee.map((fees) => (
                <Card key={fees.id} variant="outlined" sx={{ width: 300, margin: 2 }} >
                    <Box sx={{ p: 2, height: 140, backgroundColor: "#bbdefb" }}>
                        <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography gutterBottom variant="h5" component="div">{fees.fee.name}</Typography>
                        </Stack>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            Description: {fees.description}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            Status: <Chip color={fees.status === "Pending" ? "error" : "success"} label={fees.status} size="small" />
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            Created: {new Date(fees.created_date).toLocaleDateString("vi-VN")}
                        </Typography>
                    </Box>
                    <Divider />
                    <Box sx={{ p: 2, maxHeight: 140, backgroundColor: "#90caf9" }}>
                        <div>
                            <Typography level="body-xs">Total price:</Typography>
                            <Typography sx={{ fontSize: 'lg', fontWeight: 'bold' }}>${fees.amount}.0</Typography>
                        </div>
                        <Typography gutterBottom variant="body1">Payment:</Typography>
                        <Stack direction="row" spacing={1}>
                            <Chip disabled={fees.status === "Paid"} label="Stripe payment" size="small" color='info' variant="outlined" onClick={() => handleStripePayment(fees.id)} />
                            <Chip disabled={fees.status === "Paid"} label="Momo payment" size="small" color='danger' variant="outlined" onClick={() => handleMomoPayment(fees.id)} />
                        </Stack>
                    </Box>
                </Card>
            ))}
        </Box>
    );
};


export default MonthlyFeeContent;