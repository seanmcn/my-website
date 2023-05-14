---
title: "How I'm utilising ChatGPT"
date: "2023-05-13T22:15:10.429Z"
slug: "2023/05/using-chat-gpt"
category: "AI"
tags: ["ai", "chat-gpt"]
keywords: ["ai", "chat-gpt", "gpt3", "programming"]
featured: images/robot-programming.png
---
I've been using Open AI's [ChatGPT](https://chat.openai.com/) for a couple of months now, it feels game changing in terms of search & handling remedial tasks. I wanted to share some ways that I've been finding it useful in enhancing my workflow day-to-day.

## Programming Questions
ChatGPT has become my go-to for programming questions now, previously I'd use Google and end up on Stack Overflow, often needing to go through multiple questions to get an answer to my question. Now it's as simple as just asking ChatGPT and getting an answer.

### Example

#### Prompt
What are the differences between PHP and GoLang?

#### Response
PHP and GoLang are both popular programming languages, but they have distinct differences in terms of their design philosophies, syntax, performance, and areas of application. Here are some key differences between PHP and GoLang:

1.  **Design Philosophy:**
    -   PHP: PHP is a dynamically typed scripting language that was initially designed for web development. It emphasizes ease of use and has a large focus on web-related functionality.
    -   GoLang: GoLang, also known as Go, is a statically typed compiled language designed to be simple, efficient, and secure. It emphasizes scalability, concurrency, and ease of deployment.
2.  **Syntax:**
    -   PHP: PHP syntax is similar to C-style languages and incorporates HTML as well. It is known for its flexibility and loose typing, allowing for quick prototyping and rapid development.
    -   GoLang: GoLang has a syntax that is more compact and minimalist. It avoids unnecessary punctuation and features a strong and statically typed system, which helps catch errors at compile-time.
3.  **Performance:**
    -   PHP: PHP is an interpreted language, which means it relies on an interpreter to execute code. While PHP has improved its performance over the years, it generally lags behind compiled languages like GoLang in terms of raw speed.
    -   GoLang: GoLang is a compiled language, which means the code is compiled into machine code before execution. It is known for its high performance, efficient memory management, and built-in support for concurrency.
4.  **Concurrency and Parallelism:**
    -   PHP: Traditional PHP implementations lack built-in support for true concurrency and parallelism. However, PHP has extensions and libraries (e.g., pthreads, ReactPHP) that can enable concurrency in certain scenarios.
    -   GoLang: GoLang has built-in support for concurrency through goroutines and channels. Goroutines are lightweight threads that allow concurrent execution, and channels facilitate communication and synchronization between goroutines.
5.  **Community and Ecosystem:**
    -   PHP: PHP has a large and mature ecosystem with extensive community support. It has numerous frameworks (e.g., Laravel, Symfony) and libraries tailored for web development, making it a popular choice for building websites and web applications.
    -   GoLang: GoLang has a growing community, although it is relatively smaller compared to PHP. It has a standard library that provides robust functionality, and there are frameworks (e.g., Gin, Echo) and libraries available for web development, networking, and other use cases.
6.  **Application Areas:**
    -   PHP: PHP is primarily used for web development. It is widely used in content management systems (e.g., WordPress), e-commerce platforms, and web applications.
    -   GoLang: GoLang is a general-purpose language suitable for a wide range of applications. It is often used for building scalable network services, system tools, cloud-native applications, and microservices.

It's important to note that the choice between PHP and GoLang depends on the specific requirements of your project, your familiarity with the language, and the ecosystem surrounding each language.

## Writing functions

ChatGPT really seems to excel at writing functions, just give it an example of input, and what you want as output and get a function back. Using this functionality does require understanding what the returned function is doing, as sometimes it does provide suboptimal or unusual results.

### Example

#### Prompt
Given an input of:

```php
$array = [
    0 => ['link' => 'https://google.com'],
    1 => ['link' => 'https://google.com/example-one'],
    2 => ['link' => 'https://google.com/example-three'],
    3 => ['link' => 'https://microsoft.com'],
    4 => ['link' => 'https://microsoft.com/example-one'],
    5 => ['link' => 'https://microsoft.com/example-three']
];
```

Write a function in PHP that returns the count of each domain.

#### Response

You can write a PHP function to count the occurrences of each domain in the given array. Here's an example implementation:
```php
function countDomains($array) {
    $domainCounts = array();

    foreach ($array as $item) {
        $link = $item['link'];
        $domain = parse_url($link, PHP_URL_HOST);

        if (isset($domainCounts[$domain])) {
            $domainCounts[$domain]++;
        } else {
            $domainCounts[$domain] = 1;
        }
    }

    return $domainCounts;
}
```

In this function, we iterate over each item in the input array. For each item, we extract the domain from the 'link' value using the `parse_url()` function with the `PHP_URL_HOST` parameter. We then check if the domain already exists in the `$domainCounts` array. If it does, we increment the count by 1. Otherwise, we initialize the count to 1.

Finally, we return the `$domainCounts` array, which contains the count of each domain in the input array.

You can call this function with your example array like this:

```php
$array = [
    0 => ['link' => 'https://google.com'],
    1 => ['link' => 'https://google.com/example-one'],
    2 => ['link' => 'https://google.com/example-three'],
    3 => ['link' => 'https://microsoft.com'],
    4 => ['link' => 'https://microsoft.com/example-one'],
    5 => ['link' => 'https://microsoft.com/example-three']
];
$result = countDomains($array);
print_r($result);
```

The output will be:
```php
Array
(
    [google.com] => 3
    [microsoft.com] => 3
)
```

This shows that the domain "google.com" appears 3 times and the domain "microsoft.com" also appears 3 times in the input array.

## Using it for web parsing

Parsing websites has always been a bit tedious, between trying to figure out the correct selectors and then using regex to get just the content you want. I've had a lot of success getting ChatGPT to do this for me rather than needing to do it manually.

### Example

#### Prompt
Using Python write me a function that goes to https://en.wikipedia.org/wiki/Aaron_Swartz and returns their DOB.

#### Response
To fetch the date of birth (DOB) of Aaron Swartz from the Wikipedia page using Python, you can utilize the `requests` and `beautifulsoup4` libraries. Make sure you have these libraries installed before running the code. Here's an example of how you can accomplish this:

```python
import requests
from bs4 import BeautifulSoup

def get_aaron_swartz_dob():
    url = "https://en.wikipedia.org/wiki/Aaron_Swartz"
    response = requests.get(url)
    if response.status_code == 200:
        soup = BeautifulSoup(response.text, "html.parser")
        infobox = soup.find(class_="infobox")
        rows = infobox.find_all("tr")
        for row in rows:
            if row.th and row.th.text == "Born":
                dob = row.td.text.strip()
                return dob
    return None

# Example usage
dob = get_aaron_swartz_dob()
if dob:
    print("Aaron Swartz's date of birth is:", dob)
else:
    print("Failed to retrieve the date of birth.")
```

The function `get_aaron_swartz_dob()` sends an HTTP GET request to the Wikipedia page and parses the HTML content using BeautifulSoup. It searches for the infobox table on the page and looks for the row containing the "Born" information. If found, it retrieves the date of birth and returns it. If the request fails or the information is not found, the function returns `None`.

Note that web scraping is subject to change as websites update their structures or terms of use. This code relies on the specific structure of the Wikipedia page as of my knowledge cutoff in September 2021. If the page structure changes significantly, the code may need to be modified accordingly.

#### Thoughts
Running this function returns: `Aaron Swartz's date of birth is: Aaron Hillel Swartz[1](1986-11-08)November 8, 1986Highland Park, Illinois,[2] U.S.` , we can have ChatGPT modify the function to correct this with another prompt in the same conversation.

#### Prompt II
The function returns: "Aaron Swartz's date of birth is: Aaron Hillel Swartz[1](1986-11-08)November 8, 1986Highland Park, Illinois,[2] U.S." I want it to return 1986-11-08

#### Response II
Apologies for the confusion. If you only want the date of birth in the format "1986-11-08," you can modify the code as follows:

```python
import requests
from bs4 import BeautifulSoup

def get_aaron_swartz_dob():
    url = "https://en.wikipedia.org/wiki/Aaron_Swartz"
    response = requests.get(url)
    if response.status_code == 200:
        soup = BeautifulSoup(response.text, "html.parser")
        infobox = soup.find(class_="infobox")
        rows = infobox.find_all("tr")
        for row in rows:
            if row.th and row.th.text == "Born":
                dob = row.td.text.strip()
                # Extract the date in the desired format (YYYY-MM-DD)
                dob = dob.split("(")[1].split(")")[0]
                return dob
    return None

# Example usage
dob = get_aaron_swartz_dob()
if dob:
    print("Aaron Swartz's date of birth is:", dob)
else:
    print("Failed to retrieve the date of birth.")
```

Now, the function will extract the date of birth from the retrieved information using string manipulation. It splits the string at the opening and closing parentheses, taking the date portion. The updated code will return "1986-11-08" as the date of birth for Aaron Swartz.

## Suggesting open source libraries
This one requires a bit more caution, as the results it gives can sometimes be incorrect, however it's a handy way to find out what you should be investigating when you're trying to achieve a task.

### Example

#### Prompt
What open source libraries are available for getting current stock prices?

#### Response
There are several open source libraries available for fetching current stock prices. Here are a few popular ones:

1.  **yfinance**: A popular library that provides access to historical market data, including stock prices, from Yahoo Finance. It can also fetch real-time data, such as current stock prices. It is based on the Yahoo Finance API. You can find more information and examples on the library's GitHub page.
2.  **Alpha Vantage**: Alpha Vantage provides a free API that allows you to retrieve real-time and historical stock data. There are several open source libraries available that wrap the Alpha Vantage API, such as "alpha_vantage" for Python. You can find more information and examples on the Alpha Vantage website.
3.  **IEX Cloud**: IEX Cloud is a financial data platform that provides access to real-time and historical stock data. They offer a free tier that includes access to basic stock price data. The "iexfinance" library for Python is an open source library that interacts with the IEX Cloud API. You can find more information and examples on the library's GitHub page.
4.  **Quandl**: Quandl is a platform that provides a wide range of financial, economic, and alternative data. They offer access to stock price data from various exchanges. The "quandl" library for Python is an open source library that allows you to interact with the Quandl API. You can find more information and examples on the Quandl website.

These are just a few examples of open source libraries available for fetching stock prices. It's always a good idea to check the documentation and examples provided by each library to understand their specific usage and features.



## Closing Thoughts
As you can see there's so much that ChatGPT can achieve, and the above only scratches the surface. If you're interested in seeing more prompts for inspiration I suggest you checkout the following GitHub repositories:
- [awesome-chatgpt-prompts](https://github.com/f/awesome-chatgpt-prompts)
- [ChatGPT-Prompts](https://github.com/yokoffing/ChatGPT-Prompts)
