import { useEffect, useState } from "react";
import countryApi from "./api/country";
import SortIcon from "@mui/icons-material/Sort";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";

function App() {
  const [countries, setCountries] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState(true);
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [selectedCountry, setSelectedCountry] = useState(null);

  const sortText = () => {
    let k = [];
    if (sort) {
      k = countries.sort((a, b) => a.name.common.localeCompare(b.name.common));
    } else {
      k = countries.sort((a, b) => b.name.common.localeCompare(a.name.common));
    }
    setSort(!sort);
    setPage(1);
    setCountries(k);
  };
  const searchInput = async () => {
    let res = [];
    if (search !== "") {
      res = await countryApi.getCountryByname(search);
    } else {
      res = await countryApi.getAllCountries();
    }
    setCountries(res.data);
  };
  const onClick = (country) => {
    setSelectedCountry(country);
    setOpen(true);
  };
  useEffect(() => {
    const fetchData = async () => {
      const res = await countryApi.getAllCountries();
      setCountries(res.data);
    };
    fetchData();
  }, []);
  return (
    <div className="w-100">
      <nav className="navbar navbar-expand-lg navbar-light bg-light p-3 mb-2">
        <div className="w-100 d-flex justify-content-around">
          <span className="navbar-brand mb-0 h1">Country Catalog</span>
          <div className="form-inline my-2 my-lg-0 d-flex">
            <input
              className="form-control mr-sm-2"
              type="search"
              placeholder="Search"
              aria-label="Search"
              onChange={(e) => setSearch(e.target.value)}
            />
            <button
              className="btn btn-outline-success my-2 my-sm-0"
              onClick={searchInput}
            >
              Search
            </button>
          </div>
        </div>
      </nav>
      <div className="container w-100 flex align-items-center p-0">
        <SortIcon onClick={sortText} />

        <div className="container d-flex flex-wrap align-items-center w-100">
          {countries.slice(25 * (page - 1), 25 * page).map((x) => {
            return (
              <div
                className="card m-1"
                style={{ width: "250px", height: "250px" }}
                key={x.name.common}
              >
                <img
                  className="card-img-top"
                  style={{
                    width: "100px",
                    height: " 50px",
                  }}
                  src={x.flags.png}
                  alt="Card flag"
                />
                <div className="card-body">
                  <h5 className="card-title" onClick={() => onClick(x)}>
                    {x.name.common}
                  </h5>
                  <p className="card-text">Official Name: {x.name.official}</p>
                </div>
              </div>
            );
          })}
        </div>
        <ul className="pagination">
          <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="page-link"
            >
              Previous
            </button>
          </li>
          <li
            className={`page-item ${
              countries.length / 25 === page ? "disabled" : ""
            }`}
          >
            <button
              disabled={countries.length / 25 === page}
              onClick={() => setPage(page + 1)}
              className="page-link"
            >
              Next
            </button>
          </li>
        </ul>
      </div>
      <Dialog open={open} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Stack direction={'row'} justifyContent='space-between'>
            <Typography fontWeight={'bold'} fontSize={30  }>{selectedCountry?.name.common}</Typography>
                  
            <img width={'100px'} height='60px' src={selectedCountry?.flags.png} alt="modal flag"/>
            </Stack>
        </DialogTitle>
        <DialogContent>
          <Stack>
            <Typography><span style={{ fontWeight: 'bold'}} >Official Name: </span>{selectedCountry?.name.official}</Typography>
            <Typography>
            <span style={{ fontWeight: 'bold'}} >Native Names:  </span>
              {selectedCountry
                ? Object.values(selectedCountry?.name.nativeName).map((x, i) => (
                    <span key={`span-offial-name${i}`}>{" " + x.official + " "}</span>
                  ))
                : ""}
            </Typography>
            <Typography><span style={{ fontWeight: 'bold'}} >CCA2:</span> {selectedCountry?.cca2}</Typography>
            <Typography><span style={{ fontWeight: 'bold'}} >CCA3:</span> {selectedCountry?.cca3}</Typography>
            <Typography>
            <span style={{ fontWeight: 'bold'}} >Alternative Country Name:</span> {selectedCountry?.altSpellings.join(", ")}
            </Typography>
            <Typography>
            <span style={{ fontWeight: 'bold'}} >Country Calling Codes:</span> {selectedCountry?.idd.root + selectedCountry?.idd.suffixes[0]}
            </Typography>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setSelectedCountry(null);
              setOpen(false);
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default App;
