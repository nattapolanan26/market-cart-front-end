import * as React from "react";
import PropTypes from "prop-types";

// ** MUI Import
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Unstable_Grid2";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import LocalGroceryStoreIcon from "@mui/icons-material/LocalGroceryStore";
// ** Third party Import
import https from "https";
import axios from "axios";

const drawerWidth = 240;
const navItems = ["Cart"];

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

function App(props) {
  const { window, productData } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [cartStock, setCartStock] = React.useState([]);
  const [number, setNumber] = React.useState([]);
  const [product, setProduct] = React.useState([]);
  const [total, setTotal] = React.useState(null);

  function convertPatternNumber(number) {
    return number.toLocaleString(navigator.language, {
      minimumFractionDigits: 2,
    });
  }

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        MUI
      </Typography>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item} disablePadding>
            <ListItemButton sx={{ textAlign: "center" }}>
              <ListItemText primary={item} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  React.useEffect(() => {
    setProduct(productData);
  }, [productData]);

  const container =
    window !== undefined ? () => window().document.body : undefined;

  const addToCart = (index, x) => {
    if (number[index] > product[index].product_total) {
      alert("สต็อคไม่พอ");
      return;
    }

    if (number[index] === undefined) {
      alert("สินค้าต้องมากกว่า 1 ชิ้น");
      return;
    }

    let newArr = [...cartStock];

    const obj = {
      ...x,
      product_total: number[index],
    };

    newArr[index] = obj;

    const total = number[index] * x.product_price;

    setCartStock(newArr);
    setTotal((prev) => prev + total);
  };

  const calculate = (index, event) => {
    let newArr = [...number];

    newArr[index] = parseInt(event.target.value);

    setNumber(newArr);
  };

  const clearSummary = () => {
    setCartStock([]);
    setTotal(0);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar component="nav">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
          >
            Product
          </Typography>
          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            {navItems.map((item) => (
              <Button key={item} sx={{ color: "#fff" }}>
                {item}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </AppBar>
      <nav>
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      </nav>
      <Box component="main" sx={{ p: 3, width: "100%" }}>
        <Toolbar />

        <Box>
          <Typography variant="h5">
            <LocalGroceryStoreIcon />
            ตะกร้าสินค้า :
          </Typography>
          <Box>
            {cartStock.length > 0
              ? cartStock.map((item) => (
                  <div key={item.product_id}>
                    <div>
                      ชื่อสินค้า : {item.product_name} / จำนวน :{" "}
                      {item.product_total} / ราคารวม :{" "}
                      {convertPatternNumber(
                        item.product_price * item.product_total
                      )}{" "}
                      บาท
                    </div>
                  </div>
                ))
              : null}
            <Typography component="p" variant="body1">
              รวมเงินทั้งสิ้น :{" "}
              <Typography component="span" variant="body1" fontWeight={600}>
                {total ? convertPatternNumber(total) : 0}
              </Typography>{" "}
              บาท
            </Typography>
            <Box>
              <Button
                variant="contained"
                color="primary"
                onClick={clearSummary}
              >
                Reset
              </Button>
            </Box>
          </Box>
        </Box>
        <Box>
          <Grid
            container
            rowSpacing={1}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          >
            {product.length > 0
              ? product.map((item, index) => (
                  <Grid key={item.product_id} xs={6}>
                    <Item>
                      <Box>
                        <Typography variant="h6">
                          {item.product_name}
                        </Typography>
                      </Box>
                      <Box>
                        ราคาสินค้า : {convertPatternNumber(item.product_price)}
                      </Box>
                      <Box>คงเหลือ : {item.product_total}</Box>
                      <Box my={2} display="flex" justifyContent="center">
                        <TextField
                          id="product_number"
                          name="product_number"
                          label="จำนวน"
                          type="text"
                          defaultValue={0}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          inputProps={{
                            style: { textAlign: "center" },
                          }}
                          onChange={(e) => calculate(index, e)}
                        />
                      </Box>
                      <Box>
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => addToCart(index, item)}
                        >
                          Add to Cart
                        </Button>
                      </Box>
                    </Item>
                  </Grid>
                ))
              : null}
          </Grid>
        </Box>
      </Box>
    </Box>
  );
}

export const getServerSideProps = async () => {
  const httpsAgent = new https.Agent({
    rejectUnauthorized: false,
  });

  const productData = await axios
    .get("https://localhost:7073/api/Product/GetAll", { httpsAgent })
    .then((res) => res.data);

  console.log(productData);

  return { props: { productData } };
};

App.propTypes = {
  window: PropTypes.func,
  productData: PropTypes.array,
};

export default App;
