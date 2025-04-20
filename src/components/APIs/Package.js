import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import TextField from "@mui/material/TextField";
import AxiosInstance from '../../config/AxiosConfig';
import { Badge, CardActions, Chip } from '@mui/material';
import { Box, flexbox } from '@mui/system';
import DoneIcon from '@mui/icons-material/Done';

const Packages = () => {
    const [q, setQ] = React.useState("")
    const [page, setPage] = React.useState(1)
    const [packages, setPackages] = React.useState([])
    const [storageLocker, setStorageLockers] = React.useState([])

    const loadStorageLocker = async () => {
        try {
            const resLocker = await AxiosInstance.get("http://127.0.0.1:8000/storage_lockers/");
            setStorageLockers(resLocker.data[0]);
            console.log("Call API Locker: ", resLocker.data[0])

        } catch (ex) {
            console.error(ex);
        } finally {

        }
    };

    const loadPackages = async () => {
        if (page > 0) {
            try {
                let packages_url = `${"http://127.0.0.1:8000/packages/"}?page=${page}&q=${q}`;
                let res = await AxiosInstance.get(packages_url);

                if (page === 1) setPackages(res.data.results);
                else if (page > 1)
                    setPackages((current) => {
                        return [...current, ...res.data.results];
                    });

                if (res.data.next === null) setPage(0);
            } catch (ex) {
                console.error(ex);
            } finally {

            }
        }
    }

    const handleConfirm = async (packageId) => {
        try {
            // Gửi request lên backend để cập nhật trạng thái
            const res = await AxiosInstance.patch(`http://127.0.0.1:8000/packages/${packageId}/`, {
                status: "Received"
            });
    
            // Cập nhật lại danh sách gói hàng trên frontend
            setPackages((prevPackages) =>
                prevPackages.map((pkg) =>
                    pkg.id === packageId ? { ...pkg, status: "Received" } : pkg
                )
            );
    
            console.log("Package confirmed:", res.data);
        } catch (error) {
            console.error("Error confirming package:", error);
        }
    };

    const search = (event) => {
        event.preventDefault();
        setPage(1);
        loadPackages();
    };


    const getCloudinaryUrl = (thumbnailPath) => {
        if (thumbnailPath?.startsWith("http")) {
            return thumbnailPath;
        }

        const CLOUDINARY_CLOUD_NAME = "dea1l3vvu";
        return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/${thumbnailPath}`;
    };


    React.useEffect(() => {
        loadStorageLocker();
    }, []);

    React.useEffect(() => {
        let timer = setTimeout(() => loadPackages(), 500);
        return () => clearTimeout(timer);
    }, [q, page]);

    return (
        <div>

            {storageLocker ? (
                <Typography variant="h4" sx={{ mt: 2 }} align='center'>
                    Locker name: {storageLocker.number}
                </Typography>
            ) : (
                <Typography variant="body1" sx={{ mt: 2 }}>
                    Loading locker data...
                </Typography>
            )}

            <form onSubmit={search} align="right">
                <TextField
                    id="search-bar"
                    className="text"
                    onChange={(e) => setQ(e.target.value)}  // Chỉ truyền hàm search
                    value={q}
                    label="Enter sender name"
                    variant="outlined"
                    placeholder="Search..."
                    size="small"
                    fullWidth="true"
                />
                <IconButton type="submit" aria-label="search">
                    <SearchIcon style={{ fill: "blue" }} />
                </IconButton>
            </form>

            <Box display="flex" color="#9e9e9e">
                {packages.map((packages) => (
                    <Card key={packages.id} sx={{ maxWidth: 300, marginTop: 2, marginRight: 4 }}>
                        <CardActionArea>
                            <CardMedia
                                component="img"
                                height="150"
                                image={getCloudinaryUrl(packages.thumbnail)}
                                alt={`Package Img: ${packages.sender_name}`}
                            />
                            <CardContent>
                                <Typography align='right'>
                                    <Chip label={packages.status} color={packages.status === "Not received" ? "error" : "success"} size='small' />
                                </Typography>

                                <Typography gutterBottom variant="h5" component="div">
                                    Sender: {packages.sender_name}
                                </Typography>

                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                    Quantity Items: {packages.quantity_items}
                                </Typography>

                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                    Receiver: {packages.recipient_name}
                                </Typography>

                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                    Description: {packages.description}
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                        <CardActions align="center">
                            <Chip
                                color="info"
                                label="Confirm receipt this packages"
                                onClick={() => handleConfirm(packages.id)}
                                deleteIcon={<DoneIcon />}
                                variant="outlined"
                                disabled={packages.status === "Received"} 
                            />
                        </CardActions>
                    </Card>
                ))}
            </Box>
        </div>

    );
}

export default Packages;