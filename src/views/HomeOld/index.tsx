import {
    HeaderContainer,
    Divider,
    TopText,
    WelcomeContainer,
    WelcomeButtons,
    TopButtons,
    Copyright,
    Version,
    TOSLink
} from "./components/index";

export default function Home() {
    return (<>
        <HeaderContainer>
            <Divider />

            <TopText />

            <WelcomeContainer>
                <WelcomeButtons />
            </WelcomeContainer>
        </HeaderContainer>

        <TopButtons />

        <Copyright />

        <Version />
        <TOSLink />
    </>);
}
