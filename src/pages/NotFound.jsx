import "./NotFound.css";

export default function NotFound() {
  return (
    <div className="notfound">
      <div className="notfound-polaroid">
        <div className="tape tape-r" />
        <div className="nf-img">
          <p className="nf-num">404</p>
        </div>
        <p className="nf-caption">lost in dhaka</p>
      </div>
      <p className="nf-text">this page doesn't exist.</p>
      <a href="/" className="btn btn-primary">go home →</a>
    </div>
  );
}