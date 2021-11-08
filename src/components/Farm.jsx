import React, {useEffect, useState} from "react";
import Layout from "./Layout";
import AuthorizedWrap from "./AuthorizedWrap";
import {makeStyles} from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {apiClient} from "../axiosClients";
import InputAdornment from "@material-ui/core/InputAdornment";
import {Divider, InputLabel, MenuItem, Select} from "@material-ui/core";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import Icon from "@material-ui/core/Icon";
import Button from "@material-ui/core/Button";


const useStyles = makeStyles((theme) => ({
  leftIcon: {
    marginRight: theme.spacing(1),
  },
}));


const Farm = () => {

  const params = new URLSearchParams(window.location.search); // id=12
  let id = params.get("id");

  const classes = useStyles();

  const [farm, setFarm] = useState({
    name: "Farm 1",
    crop: "Corn",
    crop_id: 41,
    state: "Illinois",
    state_id: 17,
    county: "Champaign",
    county_id: 17113,
    acres: 100,
    practice_id: 2,
    created: "2021-08-06",
  });

  const [states, setStates] = useState([]);
  const [selStateOption, setSelStateOption] = useState(null);
  const [selStateId, setSelStateId] = useState(null);

  const [counties, setCounties] = useState([]);
  const [selCountyOption, setSelCountyOption] = useState(null);
  const [selCountyId, setSelCountyId] = useState(null);

  const [crops, setCrops] = useState([]);
  const [selCropOption, setSelCropOption] = useState(null);
  const [selCropId, setSelCropId] = useState(null);


  useEffect(() => {
    // TODO: replace with api call to /fields/{id}
    // const field = ;

    console.log(`id changed: ${id}`);
    setSelCropId(farm.crop_id);
    const fetchStates = async () => {
      await apiClient.get(
          "states").then(result => {
        if (result.status === 200) {
          let states = result.data;
          // console.log(states);
          setStates(states);
          setSelStateOption({id: farm.state_id, name: farm.state});
          setSelStateId(farm.state_id);
        }
      }).catch((e) => {
        console.error(`Error fetching states from api: ${e}`);
      });
    };

    const fetchCrops = async () => {
      await apiClient.get(
          "crops").then(result => {
        if (result.status === 200) {
          let crops = result.data;

          crops = crops.map((ele) => {
            return {id: ele.crop_code, name: ele.name};
          });
          // console.log(crops);
          setCrops(crops);
          // if (selCropId === field.crop_id) {
          // 	setSelCropOption({id: field.crop_id, name: field.crop});
          // 	setSelCropId(field.crop_id);
          // }
        }
      }).catch((e) => {
        console.error(`Error fetching states from api: ${e}`);
      });
    };

    fetchStates();
    fetchCrops();

    // Set other inputs


  }, [farm]);

  useEffect(() => {
    const fetchCounties = async () => {
      await apiClient.get(
          `counties/${selStateId}`).then(result => {
        if (result.status === 200) {
          let counties = result.data;
          setCounties(counties);
          if (selStateId === farm.state_id) {
            setSelCountyOption({id: farm.county_id, name: farm.county});
            setSelCountyId(farm.county_id);
          }
        }
      }).catch((e) => {
        console.error(`Error fetching counties from api: ${e}`);
      });
    };

    if (selStateId !== null) {
      console.log(selStateId);
      fetchCounties();
    }

  }, [selStateId]);

  useEffect(() => {
    if (selCropId === farm.crop_id) {
      setSelCropOption({id: farm.crop_id, name: farm.crop});
      setSelCropId(farm.crop_id);
    }

  }, [selCropId, farm]);

  const handleBack = () => {
    history.push("/login");
  };

  return (
      <Layout>
        <AuthorizedWrap>
          <div className="home-content"
               style={{
                 backgroundSize: "cover",
                 backgroundPosition: "center",
               }}
          >
            <div className="appsHeader">
              Edit Farm
            </div>
            <br/>

            <div style={{maxWidth: "480px"}}>
              <h3> Farm Details</h3>
              <br/>
              <Autocomplete
                  id="states-combo-box"
                  value={states ? selStateOption : null}
                  options={states}
                  getOptionLabel={(option) => option.name}
                  getOptionSelected={(option, value) => option.id === value.id}
                  style={{width: 300}}
                  renderInput={(params) => (<TextField {...params}
                                                       label="State"
                                                       required={true}
                                                       variant="outlined"/>)}
                  onChange={(event, value) => {
                    setSelStateOption(value ? value : null);
                    setSelStateId(value ? value.id : null);
                    setSelCountyOption(null);
                    setSelCountyId(null);
                  }}
              />
              <br/>
              <Autocomplete
                  id="counties-combo-box"
                  value={counties ? selCountyOption : null}
                  options={counties}
                  getOptionLabel={(option) => option.name}
                  getOptionSelected={(option, value) => option.id === value.id}
                  style={{width: 300}}
                  renderInput={(params) => (<TextField {...params}
                                                       label="County"
                                                       required={true}
                                                       variant="outlined"/>)}
                  onChange={(event, value) => {
                    setSelCountyOption(value ? value : null);
                    setSelCountyId(value ? value.id : null);
                  }}
              />
              <br/>
              <div style={{display: "flex"}}>
                <Autocomplete
                    id="crop-combo-box"
                    value={crops ? selCropOption : null}
                    options={crops}
                    getOptionLabel={(option) => option.name.charAt(0).toUpperCase() + option.name.slice(1)}
                    getOptionSelected={(option, value) => option.id ===
                        value.id}
                    style={{width: 180}}
                    renderInput={(params) => (<TextField {...params}
                                                         label="Crop"
                                                         variant="outlined"
                                                         required={true}
                    />)}
                    onChange={(event, value) => {
                      setSelCropOption(value ? value : null);
                      setSelCropId(value ? value.id : null);
                    }}
                />

                <TextField id="baseAcres" label="Base Acres" variant="outlined" required={true}
                           style={{width: 130, marginLeft: 20}} defaultValue={50}/>

                <TextField id="plantedAcres" label="Planted Acres" variant="outlined" required={true}
                           style={{width: 130, marginLeft: 20}} defaultValue={40}/>
              </div>

              <div style={{textAlign: "right"}}>
                <Button variant="outlined" size="small"
                        style={{marginTop: "4px", backgroundColor: "#455A64", color: "white"}}>
                  <Icon className={classes.leftIcon} style={{fontSize: "0.85rem"}}> add </Icon>
                  Add Crop
                </Button>
              </div>

              <br/>

              <TextField id="farmName" label="Farm Name" variant="outlined" required={true}
                         style={{width: 220}} defaultValue="Farm 1"
              />
              <br/>
              <br/>

              <Button variant="contained" color="primary"
                  // onClick={this.calcPremiums}
                  // disabled={!this.validateInputs()}
                      style={{fontSize: "large", backgroundColor: "#455A64"}}>
                <Icon className={classes.leftIcon}> save </Icon>
                Save
              </Button>
              &nbsp;
              <Button variant="contained" color="primary"

                  // disabled={!this.validateInputs()}
                      style={{fontSize: "large", backgroundColor: "#455A64"}}>
                {/*<Icon className={classes.leftIcon}> arrow_back_ios </Icon>*/}
                Cancel
              </Button>

            </div>
          </div>

        </AuthorizedWrap>
      </Layout>
  );
};

export default Farm;
