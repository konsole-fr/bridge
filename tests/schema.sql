--
-- PostgreSQL database dump
--

-- Dumped from database version 9.6.16
-- Dumped by pg_dump version 9.6.16

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: bikes; Type: TABLE; Schema: public; Owner: saidmimouni
--

CREATE TABLE public.bikes (
    bike_id integer NOT NULL,
    name text NOT NULL,
    user_id integer NOT NULL
);


ALTER TABLE public.bikes OWNER TO saidmimouni;

--
-- Name: bikes_id_seq; Type: SEQUENCE; Schema: public; Owner: saidmimouni
--

CREATE SEQUENCE public.bikes_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.bikes_id_seq OWNER TO saidmimouni;

--
-- Name: bikes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: saidmimouni
--

ALTER SEQUENCE public.bikes_id_seq OWNED BY public.bikes.bike_id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: saidmimouni
--

CREATE TABLE public.users (
    id integer NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.users OWNER TO saidmimouni;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: saidmimouni
--

CREATE SEQUENCE public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO saidmimouni;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: saidmimouni
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: bikes bike_id; Type: DEFAULT; Schema: public; Owner: saidmimouni
--

ALTER TABLE ONLY public.bikes ALTER COLUMN bike_id SET DEFAULT nextval('public.bikes_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: saidmimouni
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: bikes; Type: TABLE DATA; Schema: public; Owner: saidmimouni
--

COPY public.bikes (bike_id, name, user_id) FROM stdin;
1	ab	1
\.


--
-- Name: bikes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: saidmimouni
--

SELECT pg_catalog.setval('public.bikes_id_seq', 113, true);


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: saidmimouni
--

COPY public.users (id, email, password, created_at) FROM stdin;
1	admin@gmail.com	password	2020-10-03 22:59:53.176136
2	sayid.mimouni@gmail.com	said	2020-10-03 22:59:53.178191
3	sayid.mimouni@gmail.com2	said	2020-10-03 22:59:53.179591
\.


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: saidmimouni
--

SELECT pg_catalog.setval('public.users_id_seq', 18, true);


--
-- Name: bikes bikes_pkey; Type: CONSTRAINT; Schema: public; Owner: saidmimouni
--

ALTER TABLE ONLY public.bikes
    ADD CONSTRAINT bikes_pkey PRIMARY KEY (bike_id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: saidmimouni
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: bikes bikes_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: saidmimouni
--

ALTER TABLE ONLY public.bikes
    ADD CONSTRAINT bikes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: TABLE bikes; Type: ACL; Schema: public; Owner: saidmimouni
--

GRANT ALL ON TABLE public.bikes TO postgres;


--
-- Name: TABLE users; Type: ACL; Schema: public; Owner: saidmimouni
--

GRANT ALL ON TABLE public.users TO postgres;


--
-- PostgreSQL database dump complete
--

