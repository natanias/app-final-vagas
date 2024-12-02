export type VagaProps = {
    id: number;
    title: String;
    description: String;
    date: String;
    phone: String;
    company: String;
};

export type RootStackParamList = {
    Login: undefined;
    FormScreen: undefined;
    Home: undefined;
    Profile: undefined;
    Details: {id: number};
};