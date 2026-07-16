import { Link } from "react-router-dom";
import Button from "../components/ui/Button";

const NotFound = () => (
  <div className="max-w-md mx-auto px-4 py-28 text-center">
    <p className="text-6xl font-display font-bold text-brand mb-2">404</p>
    <h1 className="text-xl font-semibold text-ink mb-2">Page not found</h1>
    <p className="text-ink/50 mb-6">The page you're looking for doesn't exist or has moved.</p>
    <Link to="/"><Button>Back to Home</Button></Link>
  </div>
);

export default NotFound;
