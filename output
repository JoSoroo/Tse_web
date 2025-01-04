--
-- PostgreSQL database dump
--

-- Dumped from database version 17.2
-- Dumped by pg_dump version 17.2

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: product; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product (
    id integer NOT NULL,
    name character varying(255),
    price integer,
    category character varying(255)
);


ALTER TABLE public.product OWNER TO postgres;

--
-- Name: product_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.product_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.product_id_seq OWNER TO postgres;

--
-- Name: product_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.product_id_seq OWNED BY public.product.id;


--
-- Name: products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products (
    _id integer NOT NULL,
    name text,
    price numeric,
    menuid integer,
    category text
);


ALTER TABLE public.products OWNER TO postgres;

--
-- Name: products_utf8__id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.products_utf8__id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.products_utf8__id_seq OWNER TO postgres;

--
-- Name: products_utf8__id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.products_utf8__id_seq OWNED BY public.products._id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(50) NOT NULL,
    password character varying(255) NOT NULL,
    email character varying(100) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: product id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product ALTER COLUMN id SET DEFAULT nextval('public.product_id_seq'::regclass);


--
-- Name: products _id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products ALTER COLUMN _id SET DEFAULT nextval('public.products_utf8__id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: product; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product (id, name, price, category) FROM stdin;
1	?????????? ???	40000	share food
2	?????? ?????	10000	food
3	???????? ?????????	10000	share food
4	?????????? ???????	10000	food
5	?? ???????	10000	food
6	?????? ??????	10000	food
7	????	8000	food
8	Roockie set	20000	share food
9	??????? ?????? ?????	5500	snack
10	??????? ?????? ????	9000	snack
11	??? ???	7000	food
12	Nuggets	4000	snack
13	??????? ???	7000	food
14	?? ?????	10000	share food
15	?????? ???????? ???	10000	food
16	?????? ????? ??????	10000	food
17	???????? ??????	8000	food
18	Crispy chicken	5000	snack
19	Dokbuki	4000	snack
20	Crispy chicken, dokbuki	5500	snack
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products (_id, name, price, menuid, category) FROM stdin;
1	?????????? ???	40000	\N	share food
2	?????? ?????	10000	\N	food
3	???????? ?????????	10000	\N	share food
4	?????????? ???????	10000	\N	food
5	?? ???????	10000	\N	food
6	?????? ??????	10000	\N	food
7	????	8000	\N	food
8	Roockie set	20000	\N	share food
9	??????? ?????? ?????	5500	\N	snack
10	??????? ?????? ????	9000	\N	snack
11	??? ???	7000	\N	food
12	Nuggets	4000	\N	snack
13	??????? ???	7000	\N	food
14	?? ?????	10000	\N	share food
15	?????? ???????? ???	10000	\N	food
16	?????? ????? ??????	10000	\N	food
17	???????? ??????	8000	\N	food
18	Crispy chicken	5000	\N	snack
19	Dokbuki	4000	\N	snack
20	Crispy chicken, dokbuki	5500	\N	snack
21	?????????? ???	40000	\N	share food
22	?????? ?????	10000	\N	food
23	???????? ?????????	10000	\N	share food
24	?????????? ???????	10000	\N	food
25	?? ???????	10000	\N	food
26	?????? ??????	10000	\N	food
27	????	8000	\N	food
28	Roockie set	20000	\N	share food
29	??????? ?????? ?????	5500	\N	snack
30	??????? ?????? ????	9000	\N	snack
31	??? ???	7000	\N	food
32	Nuggets	4000	\N	snack
33	??????? ???	7000	\N	food
34	?? ?????	10000	\N	share food
35	?????? ???????? ???	10000	\N	food
36	?????? ????? ??????	10000	\N	food
37	???????? ??????	8000	\N	food
38	Crispy chicken	5000	\N	snack
39	Dokbuki	4000	\N	snack
40	Crispy chicken, dokbuki	5500	\N	snack
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, username, password, email, created_at) FROM stdin;
1	soroo454	$2b$10$pmAY1XTecgz0tv4pEtErHeYraPLFAyX7NztinUa16ZI.si1UgYF3S	gvnsor0601@gmail.com	2025-01-04 13:18:43.039099
\.


--
-- Name: product_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.product_id_seq', 20, true);


--
-- Name: products_utf8__id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.products_utf8__id_seq', 40, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 1, true);


--
-- Name: product product_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product
    ADD CONSTRAINT product_pkey PRIMARY KEY (id);


--
-- Name: products products_utf8_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_utf8_pkey PRIMARY KEY (_id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- PostgreSQL database dump complete
--

