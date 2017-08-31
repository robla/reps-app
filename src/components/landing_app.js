import { h, Component } from 'preact'
import Map from './map'
import ActionPage from './action_page'
import CTABanner from './cta_banner'
import MapWrapper from './map_wrapper'
import MapHeader from './map_header'
import RepsWrapper from './reps_wrapper'
import queryAPI from '../query_api'
import { US_STATE, DATA_FINE_PRINT } from '../constants'
import OpenStatesAPI from '../openstates'
import AutocompleteContainer from './autocomplete'

class LandingApp extends Component {
  render() {
    const paramsData = queryAPI.parse()
    let locOpenStates = new OpenStatesAPI.LocalOpenStates()
    // .getDistrictsByParams will get only the districts passed by query params but map will not be useable
    // let districts = locOpenStates.getDistrictsByParams(US_STATE, paramsData) // .getDistricts(US_STATE)
    // .getDistricts will get ALL districts so map will be useable
    let districts = locOpenStates.getDistricts(US_STATE)
    console.log('districts: ', districts)
    let stateDistricts = new OpenStatesAPI.DistrictList(districts, US_STATE, locOpenStates)
    stateDistricts.preloadDistricts()
    let display
    const shouldDisplayAction = paramsData && paramsData.actionId
    const shouldDisplayRepsAndActions = paramsData
    if (shouldDisplayAction) {
      // TODO: add action display page
      display = (
        <div className="Display">
          <ActionPage {...paramsData} />
        </div>
      )
    } else if (shouldDisplayRepsAndActions) {
      display = (
        <div className="Display">
          <RepsWrapper {...paramsData} />
        </div>
      )
    } else {
      display = (
        <div className="Display">
          <CTABanner />
          <h4>Enter your address below to find actions from your CA state legislators:</h4>
            <AutocompleteContainer stateDistricts={stateDistricts} />
          <h5>{DATA_FINE_PRINT}</h5>
        </div>
      )
    }

    return (
      <div className="RepsApp">
        <MapWrapper paramsData={paramsData}>
          <MapHeader stateDistricts={stateDistricts} />
          <Map stateDistricts={stateDistricts} paramsData={paramsData} />
        </MapWrapper>
        {display}
      </div>
    )
  }
}

export default LandingApp