import JumperService from 'jumper/service';

export default class LatestNewsService extends JumperService {
    getLatestNews() {
        return this.http.get(this.hostURL+"api/newsChannel.php");
    }
}