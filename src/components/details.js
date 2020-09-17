import React, { Component } from 'react';

class Details extends Component {
    render() {
        let missionInfo = this.props.shuttleData && this.props.shuttleData.map((missionInfo, index) => {
            // Handling Dynamic render of Mission Information
            let missionName = missionInfo.mission_name + " #"+ missionInfo.flight_number;
            return(
                <div className="cardStack__box" key={index}>
                    <div className="cardStack__box_img">
                        <img src={missionInfo.links.mission_patch} alt="" />
                    </div>
                    <div className="cardStack__box_content" key={index}>
                        <h2 className="box-title">{missionName}</h2>
                        <div className="missionId">
                            Mission Ids:
                            { missionInfo.mission_id.length === 0 ? <div className="list"><li>N/A</li></div> :
                                missionInfo.mission_id.map((missionId, mission_index) => {
                                    return(
                                        <div className="list" key={mission_index}>
                                            <ul>
                                                <li>{missionId}</li>
                                            </ul>
                                        </div>
                                    );
                                })}
                        </div>
                            <p className="LaunchYear">Launch Year:<span>{missionInfo.launch_year}</span></p>
                            <p className="sucessLaunch" id={index}>Sucessful Launch :<span>{String(missionInfo.launch_success)}</span></p>
                        <p className="sucessLand">
                            Sucessful Landing :<span>{String(missionInfo.rocket.first_stage.cores[0].land_success)}</span>
                        </p>
                    </div>
                </div>
            )
        });
        return (
            <div className="cardStack">
                {missionInfo}
            </div>
        )
    }
}

export default Details;
