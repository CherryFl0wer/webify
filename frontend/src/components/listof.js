import React from 'react';
import { connect } from 'react-redux';
import { Button, Table } from 'reactstrap';

import '../assets/css/index.css';


class ListOf extends React.Component {

    render() {
        return (
            <Table hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Song Name</th>
                        <th>Artiste</th>
                        <th>Album</th>
                        <th>Added</th>
                        <th>Origin</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th scope="row">1</th>
                        <td>Mark</td>
                        <td>Otto</td>
                        <td>@mdo</td>
                        <td>2 days ago</td>
                        <td>Spotify</td>
                    </tr>
                    <tr>
                        <th scope="row">2</th>
                        <td>Jacob</td>
                        <td>Thornton</td>
                        <td>@fat</td>

                        <td>2 days ago</td>
                        <td>Spotify</td>
                    </tr>
                    <tr>
                        <th scope="row">3</th>
                        <td>Larry</td>
                        <td>the Bird</td>
                        <td>@twitter</td>

                        <td>2 days ago</td>
                        <td>Spotify</td>
                    </tr>
                </tbody>
            </Table>
        );
    }
}

const mapStateToProps = (state, ownProps) => ({
    app: state.app
});


export default connect(mapStateToProps)(ListOf);