function Footer() {
  return (
    <footer className="site-footer">
      <span>
        <strong>Pathy.</strong> Your friendly scholarship compass.
      </span>
      <span>Illustrative scholarships · Learning project</span>
      <a
        href="#main-content"
        onClick={(event) => {
          event.preventDefault();
          document.getElementById("main-content")?.focus();
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      >
        Back to top ↑
      </a>
    </footer>
  );
}
export default Footer;