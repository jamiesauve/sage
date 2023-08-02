<b>Sage</b> is a simple AI Assistant built around <b>OpenAI's ChatGPT</b>.

I've used it as a side project to showcase what my work looks like to prospective employers, since the apps I've worked on at my day job have never been open to the public.

This is an MVP (Minimum Viable Product), and I have a list of 'next steps' I've been working from. It is <b>fully responsive</b> and available across nearly all majors platforms - web, Windows, Mac, iPad/tablet, and mobile (as a PWA). Visit <a href="https://sageaiassistant.com">sageaiassistant.com</a> to try it out or download it.

In case you are curious, this is <b>what I would do next</b>, roughly in order of priority:

- Add a <b>test suite</b> (probably using Sage itself to generate it). I'm a little embarrassed that I haven't got a test suite in here already, but on a personal project, it's hard, and getting the app working was a higher priority for me than having a good test suite. That being said, I'd want to get some basic coverage in place - probably a couple of integration tests that cover the main workflow, and then some unit tests that cover the highest-traffic, highest-complexity pieces.

- Automate the <b>CI/CD</b> process (if I was making some money off this app - I can't justify the cost of that otherwise). I'd want to get it so that whenever I push code, it automatically builds the static assets and updates the S3 bucket with those, and then temporarily spins up EC2 instances to package new installers for each desktop platform and update the download files with those.

- Add an installer for <b>Linux</b>. I tried this but ran into problems, and I decided that it wasn't worth the investment of my time just yet since I don't know anyone who uses Linux anyway.

- (when possible) Add OpenAI's <b>GPT-4</b> (the newer, more powerful version of their chat AI). I requested it, but understandably I'm not very high on the priority list of folks who get to use it yet, so I have to wait.

- Add <b>SASS</b> to upgrade my CSS files and get nesting. (Or perhaps go with styled-components - I'd have to think about that more.) It's time - I've got a few CSS files, and not being able to use SASS features is starting to hurt, but it's also still small enough that it wouldn't take long to do. And then...

- Add <b>Dark Mode</b>. Because Dark Mode is awesome. I could define a couple of themes and put a cute little toggle switch in the Settings Menu.

- Add proper <b>code formatting</b> in Sage's responses. If you ask it to generate code for you (something I do often), it isn't especially pretty. I'd use a library to beautify the code so it's easy to read and use.


Since the <b>architecture</b> I used is likely of interest to prospective employers too:

The API here is very simple, and uses <b>AWS</b>. Calls go to an <b>API Gateway</b>, which passes them on to a <b>Lambda</b>; the Lambda retrieves my OpenAI API key from the <b>SSM Parameter Store</b> and decrypts it, and then calls the ChatGPT API. When it gets a response, it passes that back down to the React app. The API Gateway and the Lambda function both send error logs to <b>Cloudwatch</b> for visibility.

...I know it's generally not very wise to explain the details of your app's architecture in public, but I haven't got much to lose here. That's a good part of why I built a project like this.

Anyway, if you've gotten this far and you're still reading, you should message me and offer me a job or something :)