import { Component } from "react";
import { MainContainer } from "./App.styled";
import { Serchbar } from "./Searchbar/Searchbar";
import { ImageGallary } from "./ImageGallery/ImageGallery";


export class App extends Component {
	state = {
		search: '',
	};


	handleFormSubmit = search => {
		this.setState({ search });
	};

	render() {
		return (
			<MainContainer>
				<Serchbar searchSubmit={this.handleFormSubmit} />
				<ImageGallary
					value={this.state.search}
					imgPerPage={this.state.imgPerPage}
				/>

			</MainContainer >
		);
	}
};