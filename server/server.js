import app from './app.js';
import connectToDB from './config/dbConnection.js';

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    //db connection
    connectToDB();
    console.log(`server is listening at localhost:${PORT}`);
})