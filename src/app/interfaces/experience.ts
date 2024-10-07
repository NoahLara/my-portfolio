import { Technologie } from "./technologie";

export interface Experience {
    startYear:    string;
    endYear:      string;
    title:        string;
    company:      string;
    link:         string;
    description:  string;
    technologies: Technologie[];
}