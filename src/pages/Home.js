import Container from 'react-bootstrap/Container';
import CreateGame from '../components/CreateGame';
const Home = () => {
    return <>
        <Container>
            <div className="row">
                <div className="col-5 mob-col">
                <CreateGame />
                </div>
                <div className="col-7 col-shadow ">
                    <img src="/sprint-game/assets/banner.png" alt="banner" className="banner-image" />
                </div>
            </div>
        </Container>

    </>;
};

export default Home;