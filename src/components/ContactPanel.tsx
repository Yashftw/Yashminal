const ContactPanel = () => {
  return (
    <div id="contact-section">
      <div className="border-2 border-border bg-card panel-glow">
        <div className="bg-accent border-b-2 border-border px-4 py-2 flex items-center justify-between">
          <span className="font-pixel text-[10px] tracking-wider text-primary">CONTACT ME</span>
          <span className="text-muted-foreground font-terminal text-xs">▣</span>
        </div>

        <form
          action="https://formsubmit.co/yashrajyadav20055@gmail.com"
          method="POST"
          className="p-5 space-y-4"
        >
          <input type="hidden" name="_subject" value="New message from Yashminal portfolio" />
          <input type="hidden" name="_captcha" value="false" />
          <input type="hidden" name="_template" value="table" />

          <div className="space-y-1">
            <div className="font-pixel text-[9px] text-muted-foreground tracking-wider">NAME</div>
            <input
              name="name"
              required
              placeholder="Enter your designation..."
              className="w-full border border-border bg-background px-3 py-2 font-terminal text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
            />
          </div>

          <div className="space-y-1">
            <div className="font-pixel text-[9px] text-muted-foreground tracking-wider">EMAIL</div>
            <input
              type="email"
              name="email"
              required
              placeholder="Enter your comm channel..."
              className="w-full border border-border bg-background px-3 py-2 font-terminal text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
            />
          </div>

          <div className="space-y-1">
            <div className="font-pixel text-[9px] text-muted-foreground tracking-wider">MESSAGE</div>
            <textarea
              name="message"
              required
              rows={4}
              placeholder="Compose your transmission..."
              className="w-full border border-border bg-background px-3 py-2 font-terminal text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary resize-none"
            />
          </div>

          <button
            type="submit"
            className="interactive w-full border-2 border-primary bg-accent px-4 py-3 font-pixel text-[10px] tracking-wider text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            TRANSMIT MESSAGE
          </button>

          <div className="pt-2 border-t border-border">
            <div className="font-terminal text-[11px] text-muted-foreground">
              ▸ Messages are delivered directly to{" "}
              <span className="text-foreground">yashrajyadav20055@gmail.com</span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactPanel;

