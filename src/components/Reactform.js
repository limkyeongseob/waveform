import React from "react";
import ReactWaves, { Regions } from "@dschoon/react-waves";

export default class RegionsExample extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      wavesurfer: null,
      playing: false,
      duration: 0,
      pos: 0,
      regions: {},
    };
  }

  onLoading = ({ wavesurfer, originalArgs = [] }) => {
    this.setState({
      loaded: originalArgs[0] === 100,
      wavesurfer,
    });
    this.state.wavesurfer.enableDragSelection({
      color: "rgba(100, 149, 240, 0.3)",
    });
    this.state.wavesurfer.on("ready", () =>
      this.setState({ duration: wavesurfer.getDuration() })
    );
    this.state.wavesurfer.on("finish", () => this.setState({ playing: false }));
  };

  onPosChange = (pos, wavesurfer) => {
    this.setState({
      pos: wavesurfer.getCurrentTime(),
      wavesurfer,
    });
  };

  // Region
  secondsToPosition = (sec) => {
    return (1 / this.state.wavesurfer.getDuration()) * sec;
  };

  handleSingleRegionUpdate = (e) => {
    const newState = Object.assign(this.state, {
      regions: {
        [e.region.id]: e.region,
      },
    });
    this.setState(newState);
  };

  handleRegionClick = (e) => {
    setTimeout(() => {
      this.state.wavesurfer.seekTo(
        this.secondsToPosition(e.originalArgs[0].start)
      );
    }, 50);
  };

  handleRegionDone = () => {
    this.setState({ playing: false });
  };

  render() {
    const { duration, pos, wavesurfer } = this.state;
    return (
      <div className={"container example"}>
        <ReactWaves
          id="waveform"
          audioFile={"https://www.mfiles.co.uk/mp3-downloads/gs-cd-track2.mp3"}
          className={"react-waves"}
          options={{
            barGap: 2,
            barWidth: 1.8,
            barHeight: 2,
            cursorWidth: 0,
            height: 200,
            hideScrollbar: true,
            progressColor: "#EC407A",
            responsive: true,
            waveColor: "#D1D6DA",
          }}
          volume={1}
          zoom={1}
          pos={this.state.pos}
          playing={this.state.playing}
          onPosChange={this.onPosChange}
          onLoading={this.onLoading}
        >
          <Regions
            onSingleRegionUpdate={this.handleSingleRegionUpdate}
            onRegionClick={this.handleRegionClick}
            onRegionOut={this.handleRegionDone}
            regions={this.state.regions}
          />
        </ReactWaves>
        <div>
          {new Date(pos * 1000).toISOString().substr(11, 8)} /{" "}
          {new Date(duration * 1000).toISOString().substr(11, 8)}
        </div>
        <div
          className="play button"
          onClick={() => {
            this.setState({
              playing: !this.state.playing,
            });
          }}
        >
          {!this.state.playing ? "PLAY ▶" : "PAUSE ⏸"}
        </div>
        <div
          className="clearRegions button"
          onClick={() => {
            wavesurfer.clearRegions();
          }}
        >
          <span role="img" aria-label="clear regions button">
            ❌Clear All Resiongs
          </span>
        </div>
      </div>
    );
  }
}