import React from "react";

class Header extends React.Component {
  state = {
    searchQuery: "",
  };

  handleChange = (e) => {
    this.setState({ searchQuery: e.target.value });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.onSearch(this.state.searchQuery); // Передаем запрос на поиск в App
  };

  render() {
    return (
      <header>
        <form onSubmit={this.handleSubmit}>
          <input
            type="text"
            name="query"
            placeholder="Введите город"
            value={this.state.searchQuery}
            onChange={this.handleChange}
          />
          <button type="submit">Поиск</button>
        </form>
      </header>
    );
  }
}

export default Header;