import { Component } from "react";
import { MainContainer } from "./App.styled";
import { Serchbar } from "./Searchbar/Searchbar";
import { ImageGallary } from "./ImageGallery/ImageGallery";
import { Loader } from './Loader/Loader';
import { ShowMoreBtn } from "./Button/Button";
import { Modal } from "./Modal/Modal";
import * as Scroll from 'react-scroll';

export class App extends Component {
	state = {
		search: '',
		page: 1,
		imgPerPage: 12,
		status: 'idle',
		images: [],
		modalVisible: false,
		modalImg: '',
		modalAlt: '',
	};

	componentDidUpdate(prP, prS) {
		const newSearch = this.state.search;
		const oldSearch = prS.search;
		const newPage = this.state.page;
		const oldPage = prS.page;

		if (newSearch !== oldSearch) {
			this.setState({ images: [] })
		}

		if (newSearch !== oldSearch || newPage !== oldPage) {
			const key = '25269285-81eb312f3fd9664086502c303';
			const perPage = String(this.state.imgPerPage);
			const page = String(this.state.page);
			this.setState({ status: 'pending' })
			fetch(`https://pixabay.com/api/?q=${newSearch}&page=${page}&key=${key}&image_type=photo&orientation=horizontal&per_page=${perPage}`)
				.then(r => r.json())
				.then(images => this.setState({ images: [...this.state.images, ...images.hits] }))
				.finally(() => this.setState({ status: 'resolve' }))
		}
	}

	handleFormSubmit = search => {
		this.setState({ search: search, page: 1 });
	};

	showMoreClick = () => {
		this.setState((state) => ({ page: state.page + 1 }));
		Scroll.animateScroll.scrollToBottom({ duration: 1000 });
	}
	toggleModal = (modalImg, modalAlt) => {
		this.setState(state => ({
			modalVisible: !state.modalVisible,
			modalImg: modalImg,
			modalAlt: modalAlt,
		}))
	}
	render() {
		const { status, images, modalVisible } = this.state;

		if (status === 'idle') {
			return (
				<MainContainer>
					<Serchbar searchSubmit={this.handleFormSubmit} />
					<h1>Что будем искать???</h1>
				</MainContainer>
			)
		}

		if (status === 'pending') {
			return (
				<MainContainer>
					<Serchbar searchSubmit={this.handleFormSubmit} />
					<ImageGallary
						modalVisible={modalVisible}
						toggleModal={this.toggleModal}
						imgs={this.state.images}
					/>
					<Loader />
				</MainContainer>
			)
		}

		if (status === 'resolve') {
			return (
				<MainContainer>
					<Serchbar searchSubmit={this.handleFormSubmit} />
					<ImageGallary
						modalVisible={modalVisible}
						toggleModal={this.toggleModal}
						imgs={this.state.images}
					/>

					{modalVisible &&
						(<Modal
							img={this.state.modalImg}
							alt={this.state.modalAlt}
							onClose={this.toggleModal} />)}

					{images.length === 0 ?
						<h1> Картинок по вашему запросу не найдено ...</h1> :
						< ShowMoreBtn type="button" onClick={this.showMoreClick} />
					}
				</MainContainer>
			)
		}
	}
}